import { backendBaseUrl, FetchParams, MessageType, Url } from "../constants.js";
import { sendRequest } from "./backend.js";
import { showAlert } from "./utils.js";

const handleDocumentResponse = async (response) => {
    if (response.status === 207) throw new Error('Document request partially failed.');

    if (result?.downloadUrl) {
        const fileName = result.downloadUrl.split('/').pop();
        const downloadUrl = `${backendBaseUrl}${result.downloadUrl}`;
        $('<a>').attr({ href: downloadUrl, download: fileName, target: '_blank' }).get(0).click();
    }

    return result;
};

const getDocumentActions = ({ print = false, download = false, share = false } = {}) => ({ actions: { print, download, share } });

const sendDocumentRequest = async (url, payload) => sendRequest(url, {
    ...FetchParams.Post,
    body: JSON.stringify(payload)
}).then(handleDocumentResponse);

const sendNiner = async (payload) => sendDocumentRequest(Url.sendNiner, payload)
    .then(() => showAlert(MessageType.Success, "Niner Processed Sucessfully!", 5));

const sendGatepass = async (payload) => sendDocumentRequest(Url.sendGatepass, payload)
    .then(() => showAlert(MessageType.Success, "Gatepass Processed Sucessfully!", 5));

export const sendLatestNiner = (print, download, share) => sendNiner({
    source: 'latest',
    ...getDocumentActions({ print, download, share })
});

export const sendNinerById = (ninerId, date, print, download, share) => sendNiner({
    source: 'id',
    data: { id: ninerId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendNinerByHtml = (party, tables, qr, print, download, share) => sendNiner({
    source: 'payload',
    data: {},
    ...getDocumentActions({ print, download, share })
});

export const sendLatestGatepass = (print, download, share) => sendGatepass({
    source: 'latest',
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassById = (gatepassId, date, print, download, share) => sendGatepass({
    source: 'id',
    data: { id: gatepassId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassByHtml = (party, tables, qr, print, download, share) => sendGatepass({
    source: 'payload',
    data: {},
    ...getDocumentActions({ print, download, share })
});
