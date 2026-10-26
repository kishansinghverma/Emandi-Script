import { Messages } from "../constants.js";
import { sendNinerFromHtml } from "../services/receipt.js";
import { alertError, hideLoader, hideModal, showLoader } from "../services/utils.js";

class PrintNiner {
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

        showLoader(Messages.ProcessingNiner);
        await sendNinerFromHtml(document, print, download, share)
            .then(hideModal)
            .catch(alertError)
            .finally(hideLoader);
    }
}

export const PrintNinerR = new PrintNiner();
