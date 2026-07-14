import { MessageType } from "../constants.js";
import { sendReceiptPdf, sendTextMessage } from "./delivery.js";
import { fetchLastRecordNumber, fetchReceiptDocument, parseGatepassReceipt, parseNinerReceipt } from "./receipt.js";
import { alertError, hideLoader, showAlert, showLoader } from "./utils.js";

export const printLastNiner = async (print, download, driverMobile) => {
    showLoader('Fetching Niner...');
    try {
        const niner = await fetchReceiptDocument('/Traders/SP_Get_9R_List', '/Receipt/print_9rs');
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
    showLoader('Fetching Gatepass Number...');

    try {
        const gatepassNumber = await fetchLastRecordNumber('/Traders/SP_Get_Gatepass_List');
        const message = `Gatepass Number: ${gatepassNumber}`;

        showLoader('Sending Gatepass Number...');
        await sendTextMessage(message);

        showAlert(MessageType.Success, 'Gatepass Number Sent.', 3);
    }
    catch (err) {
        alertError(err, true);
    }
    finally {
        hideLoader();
    }
}

export const printLastReceipts = async (print, download, driverMobile) => {
    showLoader('Fetching Receipts...');

    const [niner, gatepass] = await Promise.allSettled([
        fetchReceiptDocument('/Traders/SP_Get_9R_List', '/Receipt/print_9rs'),
        fetchReceiptDocument('/Traders/SP_Get_Gatepass_List', '/Receipt/print_gps')
    ]);

    if (niner.status === 'rejected') alertError(`Unable to fetch 9R: ${niner.reason}`);
    if (gatepass.status === 'rejected') alertError(`Unable to fetch Gatepass: ${gatepass.reason}`);

    const printJobs = [];
    if (niner.status === 'fulfilled') printJobs.push(printNiner(niner.value, print, download, driverMobile));
    if (gatepass.status === 'fulfilled') printJobs.push(printGatepass(gatepass.value, print, download, driverMobile));
    if (printJobs.length === 0) { hideLoader(); return; };

    showLoader('Sending Receipts...');
    try {
        await Promise.all(printJobs);
    } catch (err) {
        throw err;
    } finally {
        hideLoader();
    }
};

export const printNiner = async (element, print, download, driverMobile) => {
    try {
        const receipt = parseNinerReceipt(element);
        return await sendReceiptPdf({
            name: 'niner',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download,
            driverMobile: driverMobile
        });
    }
    catch (err) {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    }
};

export const printGatepass = async (element, print, download, driverMobile) => {
    try {
        const receipt = parseGatepassReceipt(element);
        return await sendReceiptPdf({
            name: 'gatepass',
            party: receipt.party,
            tables: receipt.tables,
            qr: receipt.qr,
            print: print,
            forceDownload: download,
            driverMobile: driverMobile
        });
    }
    catch (err) {
        alertError(new Error(`Failed: ${err.message ?? err}`), true);
    }
};
