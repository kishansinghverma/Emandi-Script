import { sendGatepassByHtml, sendLatestGatepass, sendLatestNiner, sendNinerByHtml } from "./delivery.js";
import { parseGatepassReceipt, parseNinerReceipt } from "./receipt.js";
import { alertError, hideLoader, showLoader } from "./utils.js";

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
