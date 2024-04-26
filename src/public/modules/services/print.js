import { FetchParams, MessageType, Url } from "../constants.js";
import { alertError, handleByStatusCode, handleJsonResponse, hideLoader, showAlert, showLoader } from "./utils.js";

const fetchLastRecords = async (url, count = 1) => {
    const currentDate = new Date();
    const lastDate = new Date();
    lastDate.setDate(currentDate.getDate() - 5);

    const fromDate = `${lastDate.getDate()}/${lastDate.getMonth() + 1}/${lastDate.getFullYear()}`;
    const toDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const payload = `draw=0&order[0][column]=1&order[0][dir]=desc&start=0&length=${count}&fromDate=${fromDate}&toDate=${toDate}`;

    return fetch(url, { ...FetchParams.PostUrlEncoded, body: payload }).then(handleJsonResponse)
        .then(({ data }) => { if (data.length < 1) throw Error('No Record Found...'); return data; });
};

const fetchLastRecord = async (url) => fetchLastRecords(url).then(records => (records[0]));

const fetchLastRecordId = async (url) => fetchLastRecord(url).then(record => (record.id));

const handlePrintResponse = (async response => {
    if (response.status === 201) showAlert(MessageType.Success, 'PDF Sent Via WhatsApp.', 3)
    if (response.status === 202) showAlert(MessageType.Success, 'Print Job Sent.', 3);
    if (response.status === 200) await downloadFile(response);
});

const getHtmlPage = (content) => {
    const receipt = document.createElement('html');
    receipt.innerHTML = content;
    return receipt;
};

const fetchRecieptContent = async (recordListUrl, recordUrl) => {
    showLoader('Fetching Receipt...');
    return fetchLastRecordId(recordListUrl)
        .then(recordId => fetch(`${recordUrl}/${recordId}`).then(handleByStatusCode).then(response => (response.text())));
};

export const downloadFile = async (response) => {
    const fileName = response.url.split('/').pop();
    const binaryData = await response.blob();
    $('<a>').attr('href', window.URL.createObjectURL(binaryData)).attr('download', fileName).get(0).click();
};

export const printLastReciepts = async (print , download, driverMobile) => {
    await fetchRecieptContent('/Traders/SP_Get_9R_List', '/Receipt/print_9rs')
        .then(getHtmlPage).then(receipt => (printNiner(receipt, print, download, driverMobile))).catch(alertError);

    await fetchRecieptContent('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps')
        .then(getHtmlPage).then(receipt => (printGatepass(receipt, print, download, driverMobile))).catch(alertError).finally(hideLoader);
};

export const printNiner = async (element, print, download, driverMobile) => {
    showLoader('Processing Niner...');
    const contents = element.querySelector('body > div.row > #content');

    const requestParams = {
        ...FetchParams.Post,
        body: JSON.stringify({
            name: 'niner',
            party: $(element.querySelector('tbody > tr:nth-child(4) > td:nth-child(6) > label')).html().trim(),
            tables: [contents.querySelector('.table').outerHTML, contents.querySelector('.row .col-md-12 table').outerHTML],
            qr: contents.querySelector('#qrcode img').src,
            print: print,
            forceDownload: download,
            driverMobile: driverMobile
        })
    };

    return fetch(Url.PrintPdf, requestParams).then(handleByStatusCode).then(handlePrintResponse);
};

export const printGatepass = async (element, print, download, driverMobile) => {
    showLoader('Processing Gatepass...');
    const contents = element.querySelector('body > div.row > #content');

    const requestParams = {
        ...FetchParams.Post,
        body: JSON.stringify({
            name: 'gatepass',
            party: $(element.querySelector('tbody > tr:nth-child(1) > td:nth-child(8) > label')).html().trim(),
            tables: [
                contents.querySelector('.table').outerHTML,
                contents.querySelector('.row .col-md-12 table').outerHTML,
                contents.querySelectorAll('.row .col-md-12 table')[1].outerHTML,
                contents.querySelectorAll('.row .col-md-12 .row')[0].outerHTML,
            ],
            qr: contents.querySelector('#qrcode img').src,
            print: print,
            forceDownload: download,
            driverMobile: driverMobile
        })
    };

    return fetch(Url.PrintPdf, requestParams).then(handleByStatusCode).then(handlePrintResponse);
};