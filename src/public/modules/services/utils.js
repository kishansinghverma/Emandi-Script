import { HttpMessages, Icon, MessageType } from "../constants.js";

let notificationTimeoutId;

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

    return fetch(url, { method: 'POST', body: formData }).then(handleJsonResponse).then(response => (response.data[0]));
}

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

export const alertError = (err, rethrow = false) => {
    const error = err instanceof Error ? err : new Error(err?.message ?? err);

    if (err.response && err.response.text) {
        err.response.text().then(t => showAlert(MessageType.Error, t ?? error.message, 5));
    }
    else showAlert(MessageType.Error, error.message, 5);

    if (rethrow) throw error;
};

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

export const withButtonLoader = (element, promise) => {
    const btn = $(element);
    btn.addClass('loading').prop('disabled', true);

    return promise.catch(() => { })
        .finally(() => btn.removeClass('loading').prop('disabled', false))
};

export const validateResponse = (response) => {
    if (!response.ok)
        throw { message: HttpMessages[response.status], code: response.status, response: response }
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

export const hideAlert = (duration = 200) => {
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = undefined;
    $('.notification-container').stop(true, false).fadeOut(duration);
}

export const showAlert = (type, message, hideAfter = 0) => {
    clearTimeout(notificationTimeoutId);
    notificationTimeoutId = undefined;
    $('.notification-container').stop(true, false).removeClass(Object.values(MessageType).join(' ')).addClass(type).show();
    $('.notification-container .icon').html(Icon[type]);
    $('.notification-container .message').html(message);
    if (hideAfter > 0) notificationTimeoutId = setTimeout(() => hideAlert(), hideAfter * 1000);
}

export const getDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate()
    const month = currentDate.getMonth() + 1
    const year = currentDate.getFullYear()
    return `${day}-${month}-${year}`;
}

export const getDateOnly = (value) => {
    const isValid = /^\d{2}\/\d{2}\/\d{4}/.test(value);
    if (!isValid) return null;

    const [month, day, year] = value.split(' ')[0].split('/');
    return `${day}/${month}/${year}`;
}

export const getActionButton = (icon, color, title, handler) => $('<button>', {
    title,
    type: 'button',
    class: `btn btn-sm ${color}`
}).append($('<i>').addClass(`fa ${icon}`)).click(handler);

export const getSixrById = (sixrId) => getRecordById('/Traders/SP_Get_6R_List', sixrId);

export const getNinerById = (ninerId) => getRecordById('/Traders/SP_Get_9R_List', ninerId);

export const getGatepassById = (gatepassId) => getRecordById('/Traders/SP_Get_Gatepass_List', gatepassId);