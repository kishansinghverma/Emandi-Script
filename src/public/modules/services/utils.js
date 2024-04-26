import { HttpMessages, Icon, MessageType } from "../constants.js";

export class ComplexPromise {
    constructor() {
        this.operator = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}

export const hideModal = () => $('.custom-modal-container').hide();

export const getNestedValue = (path, record) => (path.split('.').reduce((o, k) => o && o[k], record) ?? '');

export const alertError = (err) => err.message ? showAlert(MessageType.Error, err.message, 5) : showAlert(MessageType.Error, err, 5);

export const logError = (err) => console.log(err.message);

export const showLoader = (message) => {
    $('.spinner-message').text(message);
    $('.spinner-container').stop().css({ display: 'flex' }).fadeTo(300, 1);
}

export const hideLoader = () => {
    $('.spinner-container').fadeTo(300, 0, () => {
        $('.spinner-container').css({ opacity: 0, display: 'none' });
        $('.spinner-message').text('Please Wait...');
    })
}

export const validateResponse = (response) => {
    if (!response.ok)
        throw { message: HttpMessages[response.status], code: response.status }
}

export const handleJsonResponse = (response) => {
    validateResponse(response);
    if (response.status !== 204)
        return response.json();
}

export const handleByStatusCode = (response) => {
    validateResponse(response);
    return response;
}

export const capitalize = (str) => {
    const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result.trim();
}

export const showAlert = (type, message, hideAfter = 0) => {
    $('.notification-container').removeClass(Object.values(MessageType).join(' ')).addClass(type).show();
    $('.notification-container .icon').html(Icon[type]);
    $('.notification-container .message').html(message);
    if (hideAfter > 0) setTimeout(() => $('.notification-container').fadeOut(200), hideAfter * 1000);
}