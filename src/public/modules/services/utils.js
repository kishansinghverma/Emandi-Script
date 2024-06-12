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

export const getDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    return `${day}-${month}-${year}`;
}

const formatDate = (currentDate = new Date()) => {
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    return `${day}/${month}/${year}`;
}

const getRecordById = (url, recordId) => {
    const date = new Date();
    date.setFullYear(date.getFullYear(), date.getMonth() - 18);

    const formData = new FormData();
    formData.append('draw', 1);
    formData.append('order[0][column]', 1);
    formData.append('order[0][dir]', 'desc');
    formData.append('start', 0);
    formData.append('length', 1);
    formData.append('search[value]', recordId);
    formData.append('fromDate', formatDate(date));
    formData.append('toDate', formatDate());

    return fetch(url, { method: 'POST', body: formData })
        .then(handleJsonResponse).then(response => (response.data[0]));
}

export const getSixrById = (sixrId) => getRecordById('/Traders/SP_Get_6R_List', sixrId);

export const getNinerById = (ninerId) => getRecordById('/Traders/SP_Get_9R_List', ninerId);

export const getGatepassById = (gatepassId) => getRecordById('/Traders/SP_Get_Gatepass_List', gatepassId);