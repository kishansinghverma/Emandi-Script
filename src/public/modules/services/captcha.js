import { MessageType, Url, FetchParams } from "../constants.js";
import { alertError, showAlert } from "./utils.js";
import { CaptchaLoader } from "../../assets/loader.js";

export const showCaptchaLoader = () => {
    const $input = $('#in-captcha').length ? $('#in-captcha') : $('#DNTCaptchaInputText');
    if ($input.length) {
        if (!$input.parent().hasClass('captcha-input-wrapper')) {
            $input.wrap('<div class="captcha-input-wrapper"></div>');
        }
        if (!$input.siblings('.captcha-input-loader').length) {
            $input.after(CaptchaLoader);
        }
        $input.parent().addClass('loading');
        $input.attr('placeholder', 'Resolving Captcha...');
    }
};

export const hideCaptchaLoader = () => {
    const $input = $('#in-captcha').length ? $('#in-captcha') : $('#DNTCaptchaInputText');
    if ($input.length) {
        $input.parent().removeClass('loading');
        $input.attr('placeholder', 'Captcha Code');
    }
};

const tryResolve = async (source) => {
    try {
        const img = document.getElementById(source);
        if (!img) return NaN;

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);

        const response = await fetch(Url.ResolveCaptcha, {
            ...FetchParams.Post,
            body: JSON.stringify({ base64string: canvas.toDataURL() })
        });

        if (!response.ok) {
            console.error('Captcha API Error:', response.status, response.statusText);
            return NaN;
        }

        const data = await response.json();
        const parsedText = parseInt(data.code, 10);
        return parsedText;
    } catch (error) {
        console.error('Error resolving captcha via backend:', error);
        return NaN;
    }
}

export const resolveCaptcha = async (source) => {
    showCaptchaLoader();
    
    try {
        let isResolved = false;
        let parsedText = await tryResolve(source);
        let retryCount = 1;

        while (!isResolved) {
            if (isNaN(parsedText))
                showAlert(MessageType.Error, "Captcha Error (NaN)! Retrying...", 1);
            else {
                if (parsedText < 1000 || parsedText > 9999)
                    showAlert(MessageType.Error, "Captcha Error (Range)! Retrying...", 1);
                else {
                    isResolved = true;
                    break;
                }
            }
            if (retryCount >= 3) {
                showAlert(MessageType.Error, "Captcha resolution failed, Enter manually!", 4);
                const $input = $('#in-captcha').length ? $('#in-captcha') : $('#DNTCaptchaInputText');
                $input.val('').focus();
                return null;
            }
            parsedText = await tryResolve(source);
            retryCount++;
        }
        return parsedText;
    } finally {
        hideCaptchaLoader();
    }
}

export const setResolvedCaptcha = (value, target) => {
    if (value && !isNaN(value)) {
        $(`#${target}`).val(value).trigger('input');
    }
};

export const parseCaptcha = (source, target) => {
    resolveCaptcha(source)
        .then(value => setResolvedCaptcha(value, target))
        .catch(alertError);
}

export const validateCaptcha = (response, isLogin) => {
    function invalidate() {
        showAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
        setTimeout(() => location.reload(), 1000);
    }

    if (isLogin) { if (!response.succeeded) invalidate() }
    else { if (response?.[0]?.status === 0 && response?.[0]?.msg?.includes('Captcha')) invalidate() }
}

export const onResolved = (str) => String(str).length === 4 ? $('#submit-btn').removeAttr('disabled') : $('#submit-btn').attr('disabled', true);