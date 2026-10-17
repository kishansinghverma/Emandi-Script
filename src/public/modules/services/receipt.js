import { backendBaseUrl, FetchParams, MessageType, Url } from "../constants.js";
import { sendRequest } from "./backend.js";
import { parseGatepassReceipt, parseNinerReceipt } from "./extractor.js";
import { alertError, hideLoader, showAlert, showLoader } from "./utils.js";

const handleDocumentResponse = async (response) => {
    if (!response.actions) throw new Error('Could not parse response.');

    if (Object.values(response.actions).some(action => action.status === "failure"))
        alertError("Some actions were not completed successfully!");

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

const sendNiner = async (payload) => sendDocumentRequest(Url.sendNiner, payload)
    .then(() => showAlert(MessageType.Success, "Niner Processed Successfully!", 5));

const sendGatepass = async (payload) => sendDocumentRequest(Url.sendGatepass, payload)
    .then(() => showAlert(MessageType.Success, "Gatepass Processed Successfully!", 5));

const sendLatestNiner = (print, download, share) => sendNiner({
    source: 'latest',
    ...getDocumentActions({ print, download, share })
});

export const sendNinerById = (ninerId, date, print, download, share) => sendNiner({
    source: 'id',
    data: { id: ninerId, date },
    ...getDocumentActions({ print, download, share })
});

const sendNinerByPayload = (data, print, download, share) => sendNiner({
    source: 'payload',
    data,
    ...getDocumentActions({ print, download, share })
});

const sendLatestGatepass = (print, download, share) => sendGatepass({
    source: 'latest',
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassById = (gatepassId, date, print, download, share) => sendGatepass({
    source: 'id',
    data: { id: gatepassId, date },
    ...getDocumentActions({ print, download, share })
});

const sendGatepassByPayload = (data, print, download, share) => sendGatepass({
    source: 'payload',
    data,
    ...getDocumentActions({ print, download, share })
});

export const printNinerFromHtml = (element, print, download, share) => {
    const payload = parseNinerReceipt(element);
    return sendNinerByPayload(payload, print, download, share);
};

export const printGatepassFromHtml = (element, print, download, share) => {
    const payload = parseGatepassReceipt(element);
    return sendGatepassByPayload(payload, print, download, share);
};

const printLastNiner = (print, download, share) => {
    showLoader('Processing Niner...');
    return sendLatestNiner(print, download, share).catch(alertError).finally(hideLoader);
};

const printLastGatepass = (print, download, share) => {
    showLoader('Processing Gatepass...');
    return sendLatestGatepass(print, download, share).catch(alertError).finally(hideLoader);
};

export const printLastReceipts = async (print, download, share) => {
    await printLastNiner(print, download, share);
    await printLastGatepass(print, download, share);
};