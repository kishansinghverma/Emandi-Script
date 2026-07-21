import Tesseract from "../../assets/tesseract.js"
import { MessageType } from "../constants.js";
import { alertError, showAlert } from "./utils.js";

const tryResolve = async (source) => {
    const canvas = document.createElement("canvas");
    canvas.width = 70;
    canvas.height = 40;
    canvas.getContext("2d").drawImage(document.getElementById(source), 0, 0);
    const image = document.createElement('img');
    image.src = canvas.toDataURL();
    const resolvedData = await Tesseract.recognize(image, 'eng', {});
    const parsedText = parseInt(resolvedData.data.text);
    return parsedText;
}

class CaptchaHandler {
    async resolveCaptcha(source) {
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
            if (retryCount > 2) location.reload();
            parsedText = await tryResolve(source);
            retryCount++;
        }
        return parsedText;
    }

    setResolvedCaptcha(value, target) {
        $(`#${target}`).val(value).trigger('input');
    }

    parseCaptcha(source, target) {
        this.resolveCaptcha(source)
            .then(value => this.setResolvedCaptcha(value, target))
            .catch(alertError);
    }

    validateCaptcha(response, isLogin) {
        function invalidate() {
            showAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
            setTimeout(() => location.reload(), 1000);
        }

        if (isLogin) { if (!response.succeeded) invalidate() }
        else { if (response[0].status === 0 && response[0].msg?.includes('Captcha')) invalidate() }
    }

    onResolved(str) {
        str.length === 4 ? $('#submit-btn').removeAttr('disabled') : $('#submit-btn').attr('disabled', true);
    }
}

export const captchaHandler = new CaptchaHandler();

// Keep backward compatibility exports for files that still import individual functions directly
export const resolveCaptcha = captchaHandler.resolveCaptcha.bind(captchaHandler);
export const setResolvedCaptcha = captchaHandler.setResolvedCaptcha.bind(captchaHandler);
export const parseCaptcha = captchaHandler.parseCaptcha.bind(captchaHandler);
export const validateCaptcha = captchaHandler.validateCaptcha.bind(captchaHandler);
export const onResolved = captchaHandler.onResolved.bind(captchaHandler);