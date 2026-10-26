import { backendBaseUrl, FetchParams, Messages, MessageType, Url } from "../constants.js";
import { sendRequest } from "./backend.js";
import { getGatepassPayload, getNinerPayload, parseGatepassReceipt, parseNinerReceipt } from "./extractor.js";
import { getGatepassBySerialNumber, getLatestGatepass, getLatestNiner, getNinerBySerialNumber } from "./entries.js";
import { alertError, hideLoader, showAlert, showLoader } from "./components.js";

const handleDocumentResponse = async (response) => {
    if (!response.actions) throw new Error('Could not parse response.');

    if (Object.values(response.actions).some(action => action.status === "failure"))
        alertError(Messages.ReceiptActionFailed);

    if (response.actions?.download?.status === 'success') {
        const url = response.actions?.download?.url;
        const fileName = url.split('/').pop();
        const downloadUrl = `${backendBaseUrl}${url}`;
        $('<a>').attr({ href: downloadUrl, download: fileName, target: '_blank' }).get(0).click();
    }
};

const getDocumentActions = ({ print = false, download = false, share = false } = {}) => ({ actions: { print, download, share } });

const sendDocumentRequest = async (url, payload) => sendRequest(url, {
    ...FetchParams.Post,
    body: JSON.stringify(payload)
}).then(handleDocumentResponse);

const sendNiner = async (receiptData, print, download, share, qr) => {
    const actions = getDocumentActions({ print, download, share });
    const payload = { data: receiptData, ...actions, ...(qr ? { qr } : {}) };

    return sendDocumentRequest(Url.sendNiner, payload).then(() => showAlert(MessageType.Success, Messages.NinerProcessed, 5));
};

const sendLatestNiner = async (print, download, share) => {
    const niner = await getLatestNiner();
    const receiptData = getNinerPayload(niner);
    return sendNiner(receiptData, print, download, share);
};

const sendGatepass = async (receiptData, print, download, share, qr) => {
    const actions = getDocumentActions({ print, download, share });
    const payload = { data: receiptData, ...actions, ...(qr ? { qr } : {}) };

    return sendDocumentRequest(Url.sendGatepass, payload).then(() => showAlert(MessageType.Success, Messages.GatepassProcessed, 5));
};

const sendLatestGatepass = async (print, download, share) => {
    const gatepass = await getLatestGatepass();
    const receiptData = getGatepassPayload(gatepass);
    return sendGatepass(receiptData, print, download, share);
};

export const sendNinerBySerialNumber = async (serialNumber, date, print, download, share) => {
    const niner = await getNinerBySerialNumber(serialNumber, date);
    const receiptData = getNinerPayload(niner);
    return sendNiner(receiptData, print, download, share);
};

export const sendNinerFromHtml = (element, print, download, share) => {
    const { qr, payload } = parseNinerReceipt(element);
    return sendNiner(payload, print, download, share, qr);
};

export const sendGatepassBySerialNumber = async (serialNumber, date, print, download, share) => {
    const gatepass = await getGatepassBySerialNumber(serialNumber, date);
    const receiptData = getGatepassPayload(gatepass);
    return sendGatepass(receiptData, print, download, share);
};

export const sendGatepassFromHtml = (element, print, download, share) => {
    const { payload, qr } = parseGatepassReceipt(element);
    return sendGatepass(payload, print, download, share, qr);
};

export const printLastReceipts = async (print, download, share) => {
    showLoader(Messages.ProcessingNiner);
    await sendLatestNiner(print, download, share).catch(alertError).finally(hideLoader);

    showLoader(Messages.ProcessingGatepass);
    await sendLatestGatepass(print, download, share).catch(alertError).finally(hideLoader);
};
