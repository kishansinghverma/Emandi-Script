import { HttpMessages, Icon, MessageType, Status } from "../constants.js";

export class ComplexPromise {
    constructor() {
        this.operator = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}

export const getNestedValue = (path, record) => (path.split('.').reduce((o, k) => o && o[k], record) ?? '');

export const alertError = (err) => err.message ? showAlert(MessageType.Error, err.message, 5) : showAlert(MessageType.Error, err, 5);

export const logError = (err) => console.log(err.message);

export const showLoader = (msg) => {
    $('#loader').show();
    if (msg) $('#processMessage span').text(msg);
}

export const hideLoader = () => {
    $('#loader').hide();
    $('#processMessage span').text('Please Wait...');
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
    HandleResponse(response);
    return response;
}

export const capitalize = (str) => {
    const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result.trim();
}

export const download = async (response) => {
    const fileName = response.url.split('/').pop();
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export const fetchLastRecord = async (url) => {
    const date = new Date();
    const toDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: `draw=0&order[0][column]=1&order[0][dir]=desc&start=0&length=1&fromDate=01/01/2024&toDate=${toDate}`
    });

    const data = await response.json();
    return data.data[0];
}

export const fetchLastRecordId = async (url) => ((await fetchLastRecord(url))?.id);

export const showAlert = (type, message, hideAfter = 0) => {
    $('.notification-container').removeClass(Object.values(MessageType).join(' ')).addClass(type).show();
    $('.notification-container .icon').html(Icon[type]);
    $('.notification-container .message').html(message);
    if (hideAfter > 0) setTimeout(() => $('.notification-container').fadeOut(200), hideAfter * 1000);
}