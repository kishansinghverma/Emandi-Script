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

export const resolveCaptcha = async (source) => {
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

export const setResolvedCaptcha = (value, target) => $(`#${target}`).val(value).trigger('input');

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
    else { if (response[0].status === 0 && response[0].msg?.includes('Captcha')) invalidate() }
}

export const onResolved = (str) => str.length === 4 ? $('#submit-btn').removeAttr('disabled') : $('#submit-btn').attr('disabled', true);