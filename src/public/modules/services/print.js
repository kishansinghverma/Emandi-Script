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

const fetchLastRecordNumber = async (url) => fetchLastRecord(url).then(record => (record.serial_number));

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

const parseNinerReceipt = (element) => {
    const contents = element?.querySelector('#content');
    const qr = contents?.querySelector('#qrcode img')?.src;
    const party = $(element?.querySelector('tbody > tr:nth-child(4) > td:nth-child(6) > label'))?.text()?.trim();
    const tables = [
        contents?.querySelector('.table')?.outerHTML,
        contents?.querySelector('.row .col-md-12 table')?.outerHTML
    ];

    if (!party || !qr || tables.some(item => !item))
        throw new Error('Unable to parse 9R receipt.');

    return { party, tables, qr };
};

const parseGatepassReceipt = (element) => {
    const contents = element?.querySelector('#content');
    const qr = contents?.querySelector('#qrcode img')?.src;
    const party = $(element?.querySelector('tbody > tr:nth-child(1) > td:nth-child(8) > label'))?.text()?.trim();
    const tables = [
        contents?.querySelector('.table')?.outerHTML,
        contents?.querySelectorAll('.row .col-md-12 table')?.[0]?.outerHTML,
        contents?.querySelectorAll('.row .col-md-12 table')?.[1]?.outerHTML,
        contents?.querySelectorAll('.row .col-md-12 table')?.[2]?.outerHTML,
        contents?.querySelector('.row .col-md-12 .row')?.outerHTML,
    ];

    if (!party || !qr || tables.slice(0, 4).some(item => !item)) {
        throw new Error('Unable to parse Gatepass receipt.');
    }

    return { party, tables, qr };
};

const fetchRecieptContent = (recordListUrl, recordUrl) => fetchLastRecordId(recordListUrl)
    .then(recordId => fetch(`${recordUrl}/${recordId}`).then(handleByStatusCode).then(response => (response.text())));

export const downloadFile = async (response) => {
    const fileName = response.url.split('/').pop();
    const binaryData = await response.blob();
    $('<a>').attr('href', window.URL.createObjectURL(binaryData)).attr('download', fileName).get(0).click();
};

export const printLastNiner = async (print, download, driverMobile) => {
    showLoader('Fetching Niner...');
    try {
        const niner = await fetchRecieptContent('/Traders/SP_Get_9R_List', '/Receipt/print_9rs').then(getHtmlPage);
        showLoader('Sending Niner...');
        await printNiner(niner, print, download, driverMobile);
    }
    catch (err) {
        alertError(err);
    }
    finally {
        hideLoader();
    }
};

export const sendLastGatepassNumber = async () => {
    showLoader('Fetching Gatepass...');
    const number = await fetchLastRecordNumber('/Traders/SP_Get_Gatepass_List').catch()
}

export const printLastReciepts = async (print, download, driverMobile) => {
    showLoader('Fetching Receipts...');

    const [niner, gatepass] = await Promise.allSettled([
        fetchRecieptContent('/Traders/SP_Get_9R_List', '/Receipt/print_9rs').then(getHtmlPage),
        fetchRecieptContent('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps').then(getHtmlPage)
    ]);

    if (niner.status === 'rejected') alertError(`Unable to fectch 9R: ${niner.reason}`);
    if (gatepass.status === 'rejected') alertError(`Unable to fectch Gatepass: ${gatepass.reason}`);

    const printJobs = [];
    if (niner.status === 'fulfilled') printJobs.push(printNiner(niner.value, print, download, driverMobile));
    if (gatepass.status === 'fulfilled') printJobs.push(printGatepass(gatepass.value, print, download, driverMobile));
    if (printJobs.length == 0) { hideLoader(); return; };

    showLoader('Sending Receipts...');
    await Promise.all(printJobs).finally(hideLoader);
};

export const printNiner = async (element, print, download, driverMobile) => {
    try {
        const receipt = parseNinerReceipt(element);

        const requestParams = {
            ...FetchParams.Post,
            body: JSON.stringify({
                name: 'niner',
                party: receipt.party,
                tables: receipt.tables,
                qr: receipt.qr,
                print: print,
                forceDownload: download,
                driverMobile: driverMobile
            })
        };

        return await fetch(Url.PrintPdf, requestParams).then(handleByStatusCode).then(handlePrintResponse);
    }
    catch (err) {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    }
};

export const printGatepass = async (element, print, download, driverMobile) => {
    try {
        const receipt = parseGatepassReceipt(element);

        const requestParams = {
            ...FetchParams.Post,
            body: JSON.stringify({
                name: 'gatepass',
                party: receipt.party,
                tables: receipt.tables,
                qr: receipt.qr,
                print: print,
                forceDownload: download,
                driverMobile: driverMobile
            })
        };

        return await fetch(Url.PrintPdf, requestParams).then(handleByStatusCode).then(handlePrintResponse);
    }
    catch (err) {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    }
};
