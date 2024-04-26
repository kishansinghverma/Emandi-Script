import { ItemsToHide, RouteMap } from '../constants.js';
import { Modals } from '../../assets/modals.js';
import { PrintRecieptButton, SendRecieptButton, notificationComponent } from '../../assets/elements.js';
import { Loader } from '../../assets/loader.js';
import { hideModal } from './utils.js';
import { printLastReciepts } from './print.js';

const hideLinks = () => ItemsToHide.forEach(item => $(item)?.hide());
const replaceLink = () => document.querySelector('[href="/Traders/NinerDashboard"]')?.setAttribute('href', '/Traders/NineR');
const initializeLoader = () => $(document.body).append(Loader);

const addLinks = () => {
    $('#aside > ul > li:nth-child(10)')?.after($(SendRecieptButton).click(() => printLastReciepts(false, false)));
    $('#aside > ul > li:nth-child(10)')?.after($(PrintRecieptButton).click(() => {
        if (confirm('Are You Sure To Print?')) printLastReciepts(true, false);
    }));
}

const initializeNotification = () => {
    $(document.body).append(notificationComponent);
    $('.notification-container .link').click(() => $('.notification-container').fadeOut());
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