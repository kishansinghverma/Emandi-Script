import { printGatepass } from "../services/print.js";
import { alertError, hideLoader, hideModal, showLoader } from "../services/utils.js";

class PrintGatepass {
    initializeForm = () => $('#print-btn').click(this.print);

    print() {
        const download = $('#forcedownload').is(':checked');
        const print = $('#print').is(':checked');
        
        showLoader('Processing Gatepass...');
        printGatepass(document, print, download)
            .then(hideModal)
            .catch(alertError)
            .finally(hideLoader);
    }
}

export const PrintGatePass = new PrintGatepass();