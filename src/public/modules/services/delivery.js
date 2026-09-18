import { FetchParams, MessageType, Url } from "../constants.js";
import { handleByStatusCode, handleJsonResponse, showAlert } from "./utils.js";

const handleDocumentResponse = async (response) => {
    const result = await handleJsonResponse(response);

    if (response.status === 207) {
        throw new Error('Document request partially failed.');
    }

    if (result?.downloadUrl) {
        const fileName = result.downloadUrl.split('/').pop();
        $('<a>').attr({ href: result.downloadUrl, download: fileName }).get(0).click();
    }

    showAlert(MessageType.Success, "Document Processed Sucessfully!", 5);
    return result;
};

const sendDocumentRequest = async (url, payload) => {
    return fetch(url, {
        ...FetchParams.Post,
        body: JSON.stringify(payload)
    }).then(handleDocumentResponse);
};

export const sendNiner = async (payload) => sendDocumentRequest(Url.sendNiner, payload);

export const sendGatepass = async (payload) => sendDocumentRequest(Url.sendGatepass, payload);

const getDocumentActions = ({ print = false, download = false, share = false } = {}) => ({ print, download, share });

export const sendNinerById = ({ ninerId, date, print, download, share }) => sendNiner({
    source: { type: 'id', ninerId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendNinerByHtml = ({ name, party, tables, qr, print, download, share }) => sendNiner({
    source: { type: 'html', name, party, tables, qr },
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassById = ({ gatepassId, date, print, download, share }) => sendGatepass({
    source: { type: 'id', gatepassId, date },
    ...getDocumentActions({ print, download, share })
});

export const sendGatepassByHtml = ({ name, party, tables, qr, print, download, share }) => sendGatepass({
    source: { type: 'html', name, party, tables, qr },
    ...getDocumentActions({ print, download, share })
});

export const sendTextMessage = async (message) => {
    return fetch(Url.SendText, {
        ...FetchParams.Post,
        body: JSON.stringify({ message })
    }).then(handleByStatusCode);
};
