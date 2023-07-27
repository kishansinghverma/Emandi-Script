import { LoadingIcon } from "../../assets/loader.js";
import { Download, HandleByStatusCode, AlertError, ShowAlert } from "../services/utils.js";
import { FetchParams, Url, MessageType } from "../constants.js";
import { Form } from "../services/form.js";
import { GetPrintConfig, RemovePrintConfig } from "../services/express.js";

class PrintGatepass extends Form {
    InitializeForm() {
        const config = GetPrintConfig();
        if (config.IsExpress) {
            $('#print').prop("checked", config.Target === 'Printer');
            this.Print(true);
        }
    }

    Print(isExpress = false) {
        const contents = document.querySelector('body > div.row > #content');

        const requestParams = {
            ...FetchParams.Post,
            body: JSON.stringify({
                Name: 'Gatepass',
                Party: $('tbody > tr:nth-child(1) > td:nth-child(8) > label').html(),
                Tables: [
                    contents.querySelector('.table').outerHTML,
                    contents.querySelector('.row .col-md-12 table').outerHTML,
                    contents.querySelectorAll('.row .col-md-12 table')[1].outerHTML,
                    contents.querySelectorAll('.row .col-md-12 .row')[0].outerHTML
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
                if (isExpress) {
                    RemovePrintConfig('GP');
                    setTimeout(window.close, 3000);
                }
            });
    }
}

export const PrintGatePass = new PrintGatepass();