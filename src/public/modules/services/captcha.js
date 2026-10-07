import { MessageType, Url, FetchParams } from "../constants.js";
import { showAlert } from "./utils.js";
import { CaptchaLoader } from "../../assets/loader.js";
import { sendRequest } from "./backend.js";

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
    showCaptchaLoader();

    const img = document.getElementById(source);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    const response = await sendRequest(Url.ResolveCaptcha, {
        ...FetchParams.Post,
        body: JSON.stringify({ base64string: canvas.toDataURL() })
    }).then(({ text }) => (text)).finally(hideCaptchaLoader);

    return response;
}

export const resolveCaptcha = async (source) => {
    const parsedText = await tryResolve(source).catch(err => {
        showAlert(MessageType.Error, `Captcha resolution failed, ${err.message}`, 4);
        const $input = $('#in-captcha').length ? $('#in-captcha') : $('#DNTCaptchaInputText');
        $input.val('').focus();
    });

    if (parsedText && /^\d{4}$/.test(parsedText)) return parsedText;
}

export const setResolvedCaptcha = (value, target) => {
    if (value) $(`#${target}`).val(value).trigger('input');
};

export const validateCaptcha = (response, isLogin) => {
    function invalidate() {
        showAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
        setTimeout(() => location.reload(), 1000);
    }

    if (isLogin) { if (!response.succeeded) invalidate() }
    else { if (response?.[0]?.status === 0 && response?.[0]?.msg?.includes('Captcha')) invalidate() }
}

export const onResolved = (str) => String(str).length === 4 ? $('#submit-btn').removeAttr('disabled') : $('#submit-btn').attr('disabled', true);
