import { FetchParams, MessageType, Url } from "../constants.js";
import { AlertError, Download, FetchLastRecordId, HandleByStatusCode, HideLoader, ShowAlert, ShowLoader } from "./utils.js";

export const PrintLastReciepts = async (print, extraRecipient) => {
    try {
        const niner = await FetchElement('/Traders/SP_Get_9R_List', '/Receipt/print_9rs');
        if (niner) await PrintNiner(print, false, niner, extraRecipient);
        const gatepass = await FetchElement('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps');
        if (gatepass) await PrintGatepass(print, false, gatepass, extraRecipient);
    }
    catch (err) { AlertError(err) }
    finally { HideLoader() };
}

const FetchElement = async (getList, getRecord) => {
    ShowLoader('Searching Record...');
    const recordId = await FetchLastRecordId(getList);
    if (!recordId) {
        ShowAlert(MessageType.Info, 'No Reciept Found.', 5);
        return;
    }

    ShowLoader('Fetching Record...');
    const response = await fetch(`${getRecord}/${recordId}`);
    const html = await response.text();
    const node = document.createElement('html');
    node.innerHTML = html;
    return node;
}

export const PrintNiner = async (print, download, element, extraRecipient) => {
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

    ShowLoader('Processing Niner...');
    await SendToPrint(requestParams);
}

export const PrintGatepass = async (print, download, element, extraRecipient) => {
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

    ShowLoader('Processing Gatepass...');
    await SendToPrint(requestParams);
}

const SendToPrint = async (requestParams) => {
    const response = await fetch(Url.PrintPdf, requestParams);
    HandleByStatusCode(response);
    if (response.status === 201) ShowAlert(MessageType.Success, 'PDF Sent Via WhatsApp.', 3)
    if (response.status === 202) ShowAlert(MessageType.Success, 'Print Job Sent.', 3);
    if (response.status === 200) await Download(response);
}