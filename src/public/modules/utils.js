import { Icon, MessageType } from "./constants.js";
import Tesseract from "../assets/tesseract.js";

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

        if(retryCount > 2) location.reload();
        parsedText = await TryResolve(source);
        retryCount++;
    }

    return parsedText;
}

export const SetResolvedCaptcha = (value, target) => {
    document.getElementById(target).value = value;
    document.getElementById(target).dispatchEvent(new Event('change'));
}

export const ParseCaptcha = (source, target) => {
    this.ResolveCaptcha(source).then(value => {
        this.SetResolvedCaptcha(value, target);
    }).catch(AlertError);
}

export const Capitalize = (str) => {
    const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result.trim();
}

export class ComplexPromise {
    constructor() {
        this.Operator = new Promise((resolve, reject) => {
            this.Resolve = resolve;
            this.Reject = reject;
        })
    }
};

export const InjectAlertModal = () => {
    const element = document.createElement('div');
    element.id = "notification-container";
    element.innerHTML = `<div id="notification-content" style="display: flex;">
                                <div id="icon" style="height: 24px; width: 24px;"></div>&nbsp;&nbsp;
                                <div id="message"></div>&emsp;
                                <div class="close-btn" onclick="$('#notification-container').fadeOut(200)">&#x2716;</div>
                        </div>`;

    document.body.appendChild(element);
}

export const ShowAlert = (type, message, hideAfter = 0) => {
    if (!Object.values(MessageType).includes(type)) {
        console.log('Notification Parameters Incorrect!');
        return;
    }

    $('#notification-container').removeClass();
    $('#notification-container').addClass(type);
    $('#icon').html(Icon[type]);
    $('#message').html(message);
    $('#notification-container').show();

    if (hideAfter > 0)
        setTimeout(() => $('#notification-container').fadeOut(200), hideAfter * 1000);
}