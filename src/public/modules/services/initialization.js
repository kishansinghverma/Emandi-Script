import * as CommonFunctions from './common.js';
import { ItemsToHide, RouteMap } from '../constants.js';
import { Modals } from '../../assets/modals.js';
import { PrintRecieptButton, SendRecieptButton, notificationComponent } from '../../assets/elements.js';

const hideLinks = () => ItemsToHide.forEach(item => $(item)?.hide());
const replaceLink = () => document.querySelector('[href="/Traders/NinerDashboard"]')?.setAttribute('href', '/Traders/NineR');
const hookCommonFunctions = () => { window.commonContext = CommonFunctions };
const addLinks = () => [SendRecieptButton, PrintRecieptButton].forEach(item => $('#aside > ul > li:nth-child(10)')?.after($(item)));
const initializeNotification = () => {
    $(document.body).append(notificationComponent);
    $('.notification-container .link').click(()=>$('.notification-container').fadeOut());
}

const executeAlways = () => {
    initializeNotification();
}

const executePostLogin = () => {
    replaceLink();
    addLinks();
    hideLinks();
    hookCommonFunctions();
}

export const executeScript = async () => {
    executeAlways();

    const urlSegments = window.location.href.split('/');
    if (urlSegments.includes('Traders')) executePostLogin();

    const route = urlSegments.pop().split('?')[0];
    if (!Object.keys(RouteMap).includes(route)) throw new Error('Injection not valid for this page!');

    $(RouteMap[route].Div).first().append($('<div>').addClass('custom-modal-container').html(Modals[route]));
    $('.custom-modal-container .custom-modal-header .link').click(() => $('.custom-modal-container').remove());
    window.formContext = RouteMap[route].Script;
    await window.formContext.initializeForm();
}