import { backendBaseUrl, FetchParams, MessageType, Url } from "../constants.js";
import { handleByStatusCode, handleJsonResponse, showAlert } from "./utils.js";

const handleDocumentResponse = async (response) => {
    const result = await handleJsonResponse(response);

    if (response.status === 207) {
        throw new Error('Document request partially failed.');
    }

    if (result?.downloadUrl) {
        const fileName = result.downloadUrl.split('/').pop();
        const downloadUrl = `${backendBaseUrl}${result.downloadUrl}`;
        $('<a>').attr({ href: downloadUrl, download: fileName, target: '_blank' }).get(0).click();
    }

    return result;
};

const getDocumentActions = ({ print = false, download = false, share = false } = {}) => ({ print, download, share });

const sendDocumentRequest = async (url, payload) => fetch(url, {
    ...FetchParams.Post,
    body: JSON.stringify(payload)
}).then(handleDocumentResponse);

const sendNiner = async (payload) => sendDocumentRequest(Url.sendNiner, payload)
    .then(() => showAlert(MessageType.Success, "Niner Processed Sucessfully!", 5));

const sendGatepass = async (payload) => sendDocumentRequest(Url.sendGatepass, payload)
    .then(() => showAlert(MessageType.Success, "Gatepass Processed Sucessfully!", 5));

export const sendLatestNiner = (print, download, share) => sendNiner({
    source: { type: 'latest' },
    ...getDocumentActions({ print, download, share })
});

export const sendNinerById = (ninerId, date, print, download, share) => sendNiner({
    source: { type: 'id', ninerId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendNinerByHtml = (party, tables, qr, print, download, share) => sendNiner({
    source: { type: 'html', party, tables, qr },
    ...getDocumentActions({ print, download, share })
});

export const sendLatestGatepass = (print, download, share) => sendGatepass({
    source: { type: 'latest' },
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassById = (gatepassId, date, print, download, share) => sendGatepass({
    source: { type: 'id', gatepassId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassByHtml = (party, tables, qr, print, download, share) => sendGatepass({
    source: { type: 'html', party, tables, qr },
    ...getDocumentActions({ print, download, share })
});

export const sendTextMessage = async (message) => {
    return fetch(Url.SendText, {
        ...FetchParams.Post,
        body: JSON.stringify({ message })
    }).then(handleByStatusCode);
};
