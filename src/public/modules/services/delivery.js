import { FetchParams, MessageType, Url } from "../constants.js";
import { handleByStatusCode, showAlert } from "./utils.js";

export const downloadFile = async (response) => {
    const fileName = response.url.split('/').pop();
    const binaryData = await response.blob();
    const objectUrl = window.URL.createObjectURL(binaryData);
    $('<a>').attr('href', objectUrl).attr('download', fileName).get(0).click();
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 0);
};

export const handleDeliveryResponse = async (response) => {
    if (response.status === 201) showAlert(MessageType.Success, 'PDF Sent Via WhatsApp.', 3)
    else if (response.status === 202) showAlert(MessageType.Success, 'Print Job Sent.', 3);
    else if (response.status === 200) await downloadFile(response);
    else throw new Error(`Unsupported print response status: ${response.status}`);
};

export const sendReceiptPdf = async (payload) => {
    return fetch(Url.PrintPdf, {
        ...FetchParams.Post,
        body: JSON.stringify(payload)
    }).then(handleByStatusCode).then(handleDeliveryResponse);
};

export const sendTextMessage = async (message) => {
    return fetch(Url.SendText, {
        ...FetchParams.Post,
        body: JSON.stringify({ message })
    }).then(handleByStatusCode);
};
