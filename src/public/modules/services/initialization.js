import { ItemsToHide, MessageType, RouteMap, Url } from '../constants.js';
import { Modals } from '../../assets/modals.js';
import { PrintReceiptButton, SendReceiptButton, SessionResetButton, notificationComponent } from '../../assets/elements.js';
import { Loader } from '../../assets/loader.js';
import { alertError, hideAlert, hideLoader, hideModal, showAlert, showLoader } from './utils.js';
import { printLastReceipts } from './receipt.js';
import { sendRequest } from './backend.js';

const hideLinks = () => ItemsToHide.forEach(item => $(item)?.hide());
const replaceLink = () => document.querySelector('[href="/Traders/NinerDashboard"]')?.setAttribute('href', '/Traders/NineR');
const initializeLoader = () => $(document.body).append(Loader);

const addLinks = () => {
    $('#aside > ul > li:nth-child(10)')?.after($(SendReceiptButton).click(() => printLastReceipts(false, false, true)));
    $('#aside > ul > li:nth-child(10)')?.after($(PrintReceiptButton).click(() => {
        if (confirm('Are You Sure To Print?')) printLastReceipts(true, false, false);
    }));

    $('#header > div.navbar-collapse > ul.navbar-right > li:nth-child(1)').before($(SessionResetButton).click(() => {
        showLoader('Refreshing Emandi Session...');
        sendRequest(Url.Session)
            .then(() => showAlert(MessageType.Success, 'Emandi Session Ready!'))
            .catch(alertError).finally(hideLoader);
    }));
}

const initializeNotification = () => {
    $(document.body).append(notificationComponent);
    $('.notification-container .link').click(() => hideAlert(400));
}

const initializeModal = async (route) => {
    $(RouteMap[route].Div).first().prepend($('<div>').addClass('custom-modal-container').html(Modals[route]));
    $('.custom-modal-container .custom-modal-header .link').click(hideModal);
    $('.custom-modal-container .custom-modal').attr('draggable', true)
        .on('dragstart', ({ target }) => $(target).css({ opacity: 0.01 }))
        .on('dragend', ({ target }) => $(target).css({ opacity: 1 }));

    window.formContext = RouteMap[route].Script;
    await window.formContext.initializeForm();
}

const executeAlways = () => {
    initializeNotification();
    initializeLoader();
}

const executePostLogin = () => {
    replaceLink();
    addLinks();
    hideLinks();
}

export const executeScript = async () => {
    executeAlways();

    const urlSegments = window.location.href.split('/');
    if (urlSegments.includes('Traders')) executePostLogin();

    const route = urlSegments.pop().split('?')[0];
    if (!Object.keys(RouteMap).includes(route)) throw new Error('Injection not valid for this page!');

    await initializeModal(route);
}
