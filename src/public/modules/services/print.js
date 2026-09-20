import { sendGatepassByHtml, sendLatestGatepass, sendLatestNiner, sendNinerByHtml } from "./delivery.js";
import { alertError, hideLoader, showLoader } from "./utils.js";

const parseNinerReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content');
    const qr = $contents.find('#qrcode img').attr('src');
    const party = $element.find('tbody > tr:nth-child(4) > td:nth-child(6) > label').first().text().trim();
    const tables = [
        $contents.find('.table')[0]?.outerHTML,
        $contents.find('.row .col-md-12 table')[0]?.outerHTML
    ];

    if (!party || !qr || tables.some(item => !item))
        throw new Error('Unable to parse 9R receipt.');

    return { party, tables, qr };
};

const parseGatepassReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content');
    const qr = $contents.find('#qrcode img').attr('src');
    const party = $element.find('tbody > tr:nth-child(1) > td:nth-child(8) > label').first().text().trim();
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

export const printLastNiner = (print, download, share) => {
    showLoader('Sending Niner...');
    return sendLatestNiner(print, download, share).catch(e => console.log(e)).finally(hideLoader);
};

export const printLastGatepass = (print, download, share) => {
    showLoader('Sending Gatepass...');
    return sendLatestGatepass(print, download, share).catch(alertError).finally(hideLoader);
};

export const printLastReceipts = async (print, download, share) => {
    await printLastNiner(print, download, share);
    await printLastGatepass(print, download, share);
};

export const printNinerFromHtml = (element, print, download, share) => {
    const receipt = parseNinerReceipt(element);
    return sendNinerByHtml(receipt.party, receipt.tables, receipt.qr, print, download, share)
};

export const printGatepassFromHtml = (element, print, download, share) => {
    const receipt = parseGatepassReceipt(element);
    return sendGatepassByHtml(receipt.party, receipt.tables, receipt.qr, print, download, share)
        .catch(alertError).finally(hideLoader);
};
