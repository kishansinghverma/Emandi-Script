import { printGatepassFromHtml } from "../services/print.js";
import { alertError, hideLoader, hideModal, showLoader } from "../services/utils.js";

class PrintGatepass {
    initializeForm = () => {
        $('#print-btn').click(this.print);
        $('.document-action').change(this.updateButton);
        this.updateButton();
    };

    updateButton = () => {
        $('#print-btn').prop('disabled', $('.document-action:checked').length === 0);
    };

    print = async () => {
        const download = $('#download').is(':checked');
        const print = $('#print').is(':checked');
        const share = $('#share').is(':checked');

        showLoader('Sending Gatepass...');
        await printGatepassFromHtml(document, print, download, share)
            .then(hideModal)
            .catch(alertError)
            .finally(hideLoader);
    }
}

export const PrintGatePass = new PrintGatepass();
