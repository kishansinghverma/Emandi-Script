// import { PrintNiner as PrintRecord } from "../services/print.js";
// import { AlertError, HideLoader } from "../services/utils.js";

class PrintNiner {
    InitializeForm() {}

    Print() {
        const download = $('#forcedownload').is(':checked');
        const print = $('#print').is(':checked');
        $('#customModal').hide()
        PrintRecord(print, download, document)
            .catch(AlertError)
            .finally(HideLoader);
    }
}

export const PrintNinerR = new PrintNiner();