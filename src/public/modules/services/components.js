import { Icon, Messages, MessageType } from "../constants.js";

let notificationTimeoutId;

export const withButtonLoader = (element, promise) => {
    const btn = $(element);
    btn.addClass('loading').prop('disabled', true);

    return promise.catch(() => { })
        .finally(() => btn.removeClass('loading').prop('disabled', false))
};

export const hideModal = () => $('.custom-modal-container').hide();

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
    $('.notification-container .message').text(message);
    if (hideAfter > 0) notificationTimeoutId = setTimeout(() => hideAlert(), hideAfter * 1000);
}

export const alertError = (err, rethrow = false) => {
    const error = err instanceof Error ? err : new Error(err?.message ?? err);

    if (err.response && err.response.text) {
        err.response.text().then(t => showAlert(MessageType.Error, t ?? error.message, 5));
    }
    else showAlert(MessageType.Error, error.message, 5);

    if (rethrow) throw error;
};

export const showLoader = (message) => {
    $('.spinner-message').text(message);
    $('.spinner-container').stop().css({ display: 'flex' }).fadeTo(300, 1);
}

export const hideLoader = () => {
    $('.spinner-container').fadeTo(300, 0, () => {
        $('.spinner-container').css({ opacity: 0, display: 'none' });
        $('.spinner-message').text(Messages.PleaseWait);
    })
}
