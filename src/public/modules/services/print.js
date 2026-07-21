import { MessageType } from "../constants.js";
import { sendReceiptPdf, sendTextMessage } from "./delivery.js";
import { fetchLastRecordNumber, fetchReceiptDocument, parseGatepassReceipt, parseNinerReceipt } from "./receipt.js";
import { alertError, hideLoader, showAlert, showLoader } from "./utils.js";

const fetchReceiptData = (type, listUrl, printUrl) => {
    return fetchReceiptDocument(listUrl, printUrl).then(element => {
        return type === 'niner' ? parseNinerReceipt(element) : parseGatepassReceipt(element);
    });
};

export const printLastNiner = (print, download) => {
    showLoader('Fetching Niner...');
    return fetchReceiptData('niner', '/Traders/SP_Get_9R_List', '/Receipt/print_9rs')
        .then(receipt => {
            showLoader('Sending Niner...');
            return sendReceiptPdf({
                name: 'niner',
                party: receipt.party,
                tables: receipt.tables,
                qr: receipt.qr,
                print: print,
                forceDownload: download,
                sendWhatsApp: !print && !download // Assuming if not printing/downloading, we want WhatsApp
            });
        })
        .catch(alertError)
        .finally(hideLoader);
};

export const sendLastGatepassNumber = () => {
    showLoader('Fetching Gatepass Number...');
    return fetchLastRecordNumber('/Traders/SP_Get_Gatepass_List')
        .then(gatepassNumber => {
            const message = `Gatepass Number: ${gatepassNumber}`;
            showLoader('Sending Gatepass Number...');
            return sendTextMessage({ message, sendWhatsApp: true });
        })
        .then(() => showAlert(MessageType.Success, 'Gatepass Number Sent.', 3))
        .catch(err => alertError(err, true))
        .finally(hideLoader);
}

export const printLastReceipts = (print, download) => {
    showLoader('Fetching Receipts...');

    return Promise.allSettled([
        fetchReceiptData('niner', '/Traders/SP_Get_9R_List', '/Receipt/print_9rs'),
        fetchReceiptData('gatepass', '/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps')
    ]).then(([niner, gatepass]) => {
        if (niner.status === 'rejected') alertError(`Unable to fetch 9R: ${niner.reason}`);
        if (gatepass.status === 'rejected') alertError(`Unable to fetch Gatepass: ${gatepass.reason}`);

        const printJobs = [];
        const sendWhatsApp = !print && !download;

        if (niner.status === 'fulfilled') {
            printJobs.push(sendReceiptPdf({ name: 'niner', party: niner.value.party, tables: niner.value.tables, qr: niner.value.qr, print, forceDownload: download, sendWhatsApp }));
        }
        if (gatepass.status === 'fulfilled') {
            printJobs.push(sendReceiptPdf({ name: 'gatepass', party: gatepass.value.party, tables: gatepass.value.tables, qr: gatepass.value.qr, print, forceDownload: download, sendWhatsApp }));
        }
        if (printJobs.length === 0) { hideLoader(); return; }

        showLoader('Sending Receipts...');
        return Promise.all(printJobs).finally(hideLoader);
    });
};

export const printNiner = (element, print, download) => {
    return Promise.resolve().then(() => {
        const receipt = parseNinerReceipt(element);
        const sendWhatsApp = !print && !download;
        return sendReceiptPdf({
            name: 'niner',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download,
            sendWhatsApp: sendWhatsApp
        });
    }).catch(err => {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    });
};

export const printGatepass = (element, print, download) => {
    return Promise.resolve().then(() => {
        const receipt = parseGatepassReceipt(element);
        const sendWhatsApp = !print && !download;
        return sendReceiptPdf({
            name: 'gatepass',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download,
            sendWhatsApp: sendWhatsApp
        });
    }).catch(err => {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    });
};
