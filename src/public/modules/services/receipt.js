import { FetchParams } from "../constants.js";
import { handleByStatusCode, handleJsonResponse } from "./utils.js";

const fetchLastRecords = async (url, count = 1) => {
    const currentDate = new Date();
    const lastDate = new Date();
    lastDate.setDate(currentDate.getDate() - 5);

    const fromDate = `${lastDate.getDate()}/${lastDate.getMonth() + 1}/${lastDate.getFullYear()}`;
    const toDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const payload = `draw=0&order[0][column]=1&order[0][dir]=desc&start=0&length=${count}&fromDate=${fromDate}&toDate=${toDate}`;

    return fetch(url, { ...FetchParams.PostUrlEncoded, body: payload }).then(handleJsonResponse)
        .then(({ data }) => { if (data.length < 1) throw new Error('No Record Found...'); return data; });
};

export const fetchLastRecord = async (url) => fetchLastRecords(url).then(records => (records[0]));

export const fetchLastRecordNumber = async (url) => fetchLastRecord(url).then(record => (record.serial_number));

export const fetchLastRecordId = async (url) => fetchLastRecord(url).then(record => (record.id));

const getHtmlPage = (content) => {
    const receipt = document.createElement('html');
    receipt.innerHTML = content;
    return receipt;
};

export const fetchReceiptDocument = (recordListUrl, recordUrl) => fetchLastRecordId(recordListUrl)
    .then(recordId => fetch(`${recordUrl}/${recordId}`).then(handleByStatusCode).then(response => (response.text())))
    .then(getHtmlPage);

export const parseNinerReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content');
    const qr = $contents.find('#qrcode img').attr('src');
    const party = $element.find('tbody > tr:nth-child(4) > td:nth-child(6) > label').text().trim();
    const tables = [
        $contents.find('.table')[0]?.outerHTML,
        $contents.find('.row .col-md-12 table')[0]?.outerHTML
    ];

    if (!party || !qr || tables.some(item => !item))
        throw new Error('Unable to parse 9R receipt.');

    return { party, tables, qr };
};

export const parseGatepassReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content');
    const qr = $contents.find('#qrcode img').attr('src');
    const party = $element.find('tbody > tr:nth-child(1) > td:nth-child(8) > label').text().trim();
    const tables = [
        $contents.find('.table')[0]?.outerHTML,
        $contents.find('.row .col-md-12 table')[0]?.outerHTML,
        $contents.find('.row .col-md-12 table')[1]?.outerHTML,
        $contents.find('.row .col-md-12 table')[2]?.outerHTML,
        $contents.find('.row .col-md-12 .row')[0]?.outerHTML,
    ];

    if (!party || !qr || tables.slice(0, 4).some(item => !item)) {
        throw new Error('Unable to parse Gatepass receipt.');
    }

    return { party, tables, qr };
};
