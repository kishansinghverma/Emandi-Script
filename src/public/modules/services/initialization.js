import * as CommonFunctions from './common.js';
import { CSS } from "../../assets/style.js";
import { ItemsToHide } from '../constants.js';
import { NotificationContainer, PrintRecieptButton, SendRecieptButton } from '../../assets/elements.js';
import { ExpressConfig } from './express.js';

const HideLinks = () => ItemsToHide.forEach(item => $(item)?.hide());
const ReplaceLink = () => document.querySelector('[href="/Traders/NinerDashboard"]')?.setAttribute('href', '/Traders/NineR');
const InjectCSS = () => document.head.appendChild($('<style>').html(CSS)[0]);
const InjectAlertModal = () => $("body").append(NotificationContainer);
const HookCommonFunctions = () => { window.commonContext = CommonFunctions };

const AddLinks = () => {
    $('#aside > ul > li:nth-child(10)')?.after($(SendRecieptButton));
    $('#aside > ul > li:nth-child(10)')?.after($(PrintRecieptButton));
}

const ClearRecordOnPageReload = () => {
    if (performance.getEntriesByType("navigation")[0].type === 'reload') {
        const configuration = localStorage.getItem("Configuration");
        if (configuration && !(JSON.parse(configuration).IsExpress))
            ExpressConfig.RemoveConfiguration();
    }
}

const InjectAlways = () => {
    InjectCSS();
    InjectAlertModal();
}

const InjectPostLogin = async () => {
    ReplaceLink();
    AddLinks();
    HideLinks();
    HookCommonFunctions();
    ClearRecordOnPageReload();
    await ExpressConfig.DisplayRecord();
}

export const RunInitialServices = async () => {
    InjectAlways();

    if (window.location.href.includes('Traders'))
        await InjectPostLogin();
}