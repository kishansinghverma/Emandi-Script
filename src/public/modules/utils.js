import { Error, Success, Info } from "../assets/loader.js";

const Icon = {
    success: Success,
    error: Error,
    info: Info
}

export const MessageType = {
    Success: 'success',
    Error: 'error',
    Info: 'info'
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