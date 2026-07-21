import { printGatepass } from "../services/print.js";
import { alertError, hideLoader, hideModal, showLoader } from "../services/utils.js";
import { BaseController } from "./base.js";

class PrintGatepass extends BaseController {
    async initializeForm() {
        this.attachListener();
    }
    attachListener() { $('#print-btn').click(this.submitForm.bind(this)); }
    async executeInitialActions() {}
    updateForm() {}

    submitForm() {
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