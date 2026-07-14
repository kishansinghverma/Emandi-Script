import { MessageType } from "../constants.js";
import { sendReceiptPdf, sendTextMessage } from "./delivery.js";
import { fetchLastRecordNumber, fetchReceiptDocument, parseGatepassReceipt, parseNinerReceipt } from "./receipt.js";
import { alertError, hideLoader, showAlert, showLoader } from "./utils.js";

export const printLastNiner = (print, download) => {
    showLoader('Fetching Niner...');
    return fetchReceiptDocument('/Traders/SP_Get_9R_List', '/Receipt/print_9rs')
        .then(niner => {
            showLoader('Sending Niner...');
            return printNiner(niner, print, download);
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
            return sendTextMessage(message);
        })
        .then(() => showAlert(MessageType.Success, 'Gatepass Number Sent.', 3))
        .catch(err => alertError(err, true))
        .finally(hideLoader);
}

export const printLastReceipts = (print, download) => {
    showLoader('Fetching Receipts...');

    return Promise.allSettled([
        fetchReceiptDocument('/Traders/SP_Get_9R_List', '/Receipt/print_9rs'),
        fetchReceiptDocument('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps')
    ]).then(([niner, gatepass]) => {
        if (niner.status === 'rejected') alertError(`Unable to fetch 9R: ${niner.reason}`);
        if (gatepass.status === 'rejected') alertError(`Unable to fetch Gatepass: ${gatepass.reason}`);

        const printJobs = [];
        if (niner.status === 'fulfilled') printJobs.push(printNiner(niner.value, print, download));
        if (gatepass.status === 'fulfilled') printJobs.push(printGatepass(gatepass.value, print, download));
        if (printJobs.length === 0) { hideLoader(); return; }

        showLoader('Sending Receipts...');
        return Promise.all(printJobs).finally(hideLoader);
    });
};

export const printNiner = (element, print, download) => {
    return Promise.resolve().then(() => {
        const receipt = parseNinerReceipt(element);
        return sendReceiptPdf({
            name: 'niner',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download
        });
    }).catch(err => {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    });
};

export const printGatepass = (element, print, download) => {
    return Promise.resolve().then(() => {
        const receipt = parseGatepassReceipt(element);
        return sendReceiptPdf({
            name: 'gatepass',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download
        });
    }).catch(err => {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    });
};
