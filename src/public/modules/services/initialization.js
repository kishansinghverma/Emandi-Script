import * as CommonFunctions from './common.js';
import { CSS } from "../../assets/style.js";
import { Events, ItemsToHide, Status, Url } from '../constants.js';
import { NotificationContainer, PrintRecieptButton, SendRecieptButton } from '../../assets/elements.js';
import { ExpressConfig } from './express.js';
import { AlertError, HandleJsonResponse, HideLoader, SetRecordStatus, ShowLoader } from './utils.js';

const HideLinks = () => ItemsToHide.forEach(item => $(item)?.hide());
const ReplaceLink = () => document.querySelector('[href="/Traders/NinerDashboard"]')?.setAttribute('href', '/Traders/NineR');
const InjectCSS = () => document.head.appendChild($('<style>').html(CSS)[0]);
const InjectAlertModal = () => $("body").append(NotificationContainer);
const HookCommonFunctions = () => { window.commonContext = CommonFunctions };

const AddLinks = () => {
    $('#aside > ul > li:nth-child(10)')?.after($(SendRecieptButton));
    $('#aside > ul > li:nth-child(10)')?.after($(PrintRecieptButton));
}

export const InjectRecordStatus = () => {
    SetRecordStatus(Status.Loading);
    
    const localData = ExpressConfig.GetConfiguration();
    if (localData)
        SetRecordStatus(Status.InProgress, localData.Record)
    else {
        ShowLoader();
        fetch(Url.PeekRecord)
            .then(HandleJsonResponse)
            .then(data => SetRecordStatus(Status.Queued, data))
            .catch((err) => err.code === 204 ? SetRecordStatus(Status.None) : AlertError(err))
            .finally(() => {
                document.body.dispatchEvent(new CustomEvent(Events.RecordLoaded));
                HideLoader()
            });
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
    ExpressConfig.DispatchActionByStage();
    InjectRecordStatus();
}

export const RunInitialServices = async () => {
    InjectAlways();

    if (window.location.href.includes('Traders'))
        await InjectPostLogin();
}