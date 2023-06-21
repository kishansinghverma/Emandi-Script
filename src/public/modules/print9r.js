import { LoadingIcon } from "../assets/loader.js";
import { Form } from "./form.js";
import { FetchParams, Url, MessageType } from "./constants.js";
import { AlertError, Download, HandleByStatusCode, HandleJsonResponse } from "./common.js";
import { ShowAlert } from "./utils.js";

class PrintNiner extends Form {
    InitializeForm() {
        if (localStorage.getItem('ExpressPrint') === "true")
            this.Print(true);
        else {
            const sixrId = $('#tab_logic > tbody > tr > td:nth-child(8) > label').html().trim();
            fetch(`${Url.GetBySixR}=${sixrId}`)
                .then(HandleJsonResponse)
                .then(data => $('#print').prop('checked', data?.Mode === "Print").trigger('change'))
                .catch(err => { if (err.code !== 204) AlertError(err) })
                .finally(() => $('#record').html(''));
        }
    }

    RedirectPage() {
        window.location.href = '/Traders/Dashboard';
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
                if (isExpress) {
                    localStorage.removeItem('ExpressPrint');
                    if (confirm("Express Flow Is Complete!\nDo You Want To Redirect To Home?"))
                        this.RedirectPage();
                }
            });
    }
}

export const PrintNinerR = new PrintNiner();