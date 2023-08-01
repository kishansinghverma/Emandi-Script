import Tesseract from "../../assets/tesseract.js"
import { MessageType, Status } from "../constants.js";
import { ExpressConfig } from "./express.js";
import { ShowAlert } from "./utils.js";

const TryResolve = async (source) => {
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

export const ResolveCaptcha = async (source) => {
    let isResolved = false;
    let parsedText = await TryResolve(source);
    let retryCount = 1;

    while (!isResolved) {
        if (isNaN(parsedText))
            ShowAlert(MessageType.Error, "Captcha Error (NaN)! Retrying...", 1);
        else {
            if (parsedText < 1000 || parsedText > 9999)
                ShowAlert(MessageType.Error, "Captcha Error (Range)! Retrying...", 1);
            else {
                isResolved = true;
                break;
            }
        }
        if (retryCount > 2) location.reload();
        parsedText = await TryResolve(source);
        retryCount++;
    }
    return parsedText;
}

export const SetResolvedCaptcha = (value, target) => $(`#${target}`).val(value).trigger('change');
   
export const ParseCaptcha = (source, target) => {
    ResolveCaptcha(source).then(value => {
        SetResolvedCaptcha(value, target);
    }).catch(AlertError);
}

export const ValidateCaptcha = (response, isLogin) => {
    function Invalidate() {
        ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
        const configuration = ExpressConfig.GetConfiguration();
        if (configuration) ExpressConfig.SetConfiguration({ ...configuration, Status: Status.Init });
        setTimeout(() => location.reload(), 1000);
    }

    if (isLogin) { if (!response.succeeded) Invalidate() }
    else { if (response[0].status === 0 && response[0].msg?.includes('Captcha')) Invalidate() }
}