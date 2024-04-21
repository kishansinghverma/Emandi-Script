import { FetchParams, MessageType, Url } from "../constants.js";
import { alertError, download, fetchLastRecordId, handleByStatusCode, hideLoader, showAlert, showLoader } from "./utils.js";

export const printLastReciepts = async (print, extraRecipient) => {
    try {
        const niner = await fetchElement('/Traders/SP_Get_9R_List', '/Receipt/print_9rs');
        if (niner) await printNiner(print, false, niner, extraRecipient);
        const gatepass = await fetchElement('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps');
        if (gatepass) await printGatepass(print, false, gatepass, extraRecipient);
    }
    catch (err) { alertError(err) }
    finally { hideLoader() };
}

const fetchElement = async (getList, getRecord) => {
    showLoader('Searching Record...');
    const recordId = await fetchLastRecordId(getList);
    if (!recordId) {
        showAlert(MessageType.Info, 'No Reciept Found.', 5);
        return;
    }

    showLoader('Fetching Record...');
    const response = await fetch(`${getRecord}/${recordId}`);
    const html = await response.text();
    const node = document.createElement('html');
    node.innerHTML = html;
    return node;
}

export const printNiner = async (print, download, element, extraRecipient) => {
    const contents = element.querySelector('body > div.row > #content');

    const requestParams = {
        ...FetchParams.Post,
        body: JSON.stringify({
            Name: 'Niner',
            Party: $(element.querySelector('tbody > tr:nth-child(4) > td:nth-child(6) > label')).html().trim(),
            Tables: [
                contents.querySelector('.table').outerHTML,
                contents.querySelector('.row .col-md-12 table').outerHTML
            ],
            QR: contents.querySelector('#qrcode img').src,
            Print: print,
            ForceDownload: download,
            ExtraRecipient: extraRecipient
        })
    };

    showLoader('Processing Niner...');
    await sendToPrint(requestParams);
}

export const printGatepass = async (print, download, element, extraRecipient) => {
    const contents = element.querySelector('body > div.row > #content');

    const requestParams = {
        ...FetchParams.Post,
        body: JSON.stringify({
            Name: 'Gatepass',
            Party: $(element.querySelector('tbody > tr:nth-child(1) > td:nth-child(8) > label')).html().trim(),
            Tables: [
                contents.querySelector('.table').outerHTML,
                contents.querySelector('.row .col-md-12 table').outerHTML,
                contents.querySelectorAll('.row .col-md-12 table')[1].outerHTML,
                contents.querySelectorAll('.row .col-md-12 .row')[0].outerHTML
            ],
            QR: contents.querySelector('#qrcode img').src,
            Print: print,
            ForceDownload: download,
            ExtraRecipient: extraRecipient
        })
    };

    showLoader('Processing Gatepass...');
    await sendToPrint(requestParams);
}

const sendToPrint = async (requestParams) => {
    const response = await fetch(Url.PrintPdf, requestParams);
    handleByStatusCode(response);
    if (response.status === 201) showAlert(MessageType.Success, 'PDF Sent Via WhatsApp.', 3)
    if (response.status === 202) showAlert(MessageType.Success, 'Print Job Sent.', 3);
    if (response.status === 200) await download(response);
}