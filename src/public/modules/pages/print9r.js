import { printNiner } from "../services/print.js";
import { alertError, hideLoader, hideModal } from "../services/utils.js";

class PrintNiner {
    initializeForm = () => $('#print-btn').click(this.print);

    print = () => {
        const download = $('#forcedownload').is(':checked');
        const print = $('#print').is(':checked');
        printNiner(document, print, download)
            .then(hideModal)
            .catch(alertError)
            .finally(hideLoader);
    }
}

export const PrintNinerR = new PrintNiner();