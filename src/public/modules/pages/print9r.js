import { LoadingIcon } from "../../assets/loader.js";
import { Form } from "../services/form.js";
import { FetchParams, Url, MessageType } from "../constants.js";
import { AlertError, Download, ShowAlert, HandleByStatusCode } from "../services/utils.js";
import { GetPrintConfig } from "../services/express.js";

class PrintNiner extends Form {
    InitializeForm() {
        const config = GetPrintConfig();
        if (config.IsExpress) {
            $('#print').prop("checked", config.Target === 'Printer');
            this.Print(true);
        }
    }

    RedirectPage() {
        window.location.href = `/Receipt/print_gps/${GetPrintConfig().GP}`;
    }

    Print(isExpress = false) {
        const contents = document.querySelector('body > div.row > #content');

        const requestParams = {
            ...FetchParams.Post,
            body: JSON.stringify({
                Name: 'Niner',
                Party: $('tbody > tr:nth-child(4) > td:nth-child(6) > label').html().trim(),
                Tables: [
                    contents.querySelector('.table').outerHTML,
                    contents.querySelector('.row .col-md-12 table').outerHTML
                ],
                QR: contents.querySelector('#qrcode img').src,
                Print: $('#print').is(':checked'),
                ForceDownload: $('#forcedownload').is(':checked')
            })
        };

        $('#modalContent').html(`${LoadingIcon}<hr><div>Please Wait<div>`);

        fetch(Url.PrintPdf, requestParams)
            .then(HandleByStatusCode)
            .then(async response => {
                if (response.status === 201) ShowAlert(MessageType.Success, 'PDF Sent Via WhatsApp.', 3)
                if (response.status === 202) ShowAlert(MessageType.Success, 'Print Job Sent.', 3);
                if (response.status === 200) await Download(response);
            })
            .catch(AlertError)
            .finally(() => {
                $('#customModal').hide();
                if (isExpress) this.RedirectPage();
            });
    }
}

export const PrintNinerR = new PrintNiner();