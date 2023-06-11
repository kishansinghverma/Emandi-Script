import { LoadingIcon } from "../assets/loader.js";
import { Download, HandleJsonResponse, HandleByStatusCode, AlertError } from "./common.js";
import { FetchParams, Url, MessageType } from "./constants.js";
import { Form } from "./form.js";
import { ShowAlert } from "./utils.js";

class PrintGatepass extends Form {
    InitializeForm() {
        if (localStorage.getItem('ExpressPrint') === "true")
            this.Print(true);
        else {
            const ninerId = $('#content > table.table.table-bordered > tbody > tr:nth-child(1) > td:nth-child(4) > label').html().trim();

            fetch(`${Url.GetByNineR}=${ninerId}`)
                .then(HandleJsonResponse)
                .then(data => $('#print').prop('checked', data?.Mode === "Print").trigger('change'))
                .catch(err => { if (err.code !== 204) AlertError(err) })
                .finally(() => $('#record').html(''));
        }
    }

    RedirectPage() {
        window.location.href = '/Traders/generated_9R';
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
            .then(() => { if (isExpress) this.RedirectPage() })
            .catch(AlertError)
            .finally(() => $('#customModal').hide());
    }
}

export const PrintGatePass = new PrintGatepass();