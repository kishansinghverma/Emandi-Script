import { LoadingIcon } from "../assets/loader.js";
import { Form } from "./form.js";
import { FetchParams, Url } from "./constants.js";
import { AlertError, Download, HandleByStatusCode, HandleJsonResponse } from "./common.js";

class PrintNiner extends Form {
    InitializeForm() {
        if (localStorage.getItem('ExpressPrint') === "true")
            this.Print(true, true);
        else {
            const sixrId = $('#tab_logic > tbody > tr > td:nth-child(8) > label').html().trim();
            fetch(`${Url.GetBySixR}=${sixrId}`)
                .then(HandleJsonResponse)
                .then(data => $('#download').prop('checked', data?.Mode === "PDF").trigger('change'))
                .catch(err => { if (err.code !== 204) AlertError(err) })
                .finally(() => { $('#record').html('') });
        }
    }

    Print(download, isExpress = false) {
        $('#modalContent').html(`${LoadingIcon}<hr><div>Please Wait<div>`);
        const contents = document.querySelector('body > div.row > #content');

        const tables = [
            contents.querySelector('.table').outerHTML,
            contents.querySelector('.row .col-md-12 table').outerHTML
        ];

        const requestParams = {
            ...FetchParams.Post,
            body: JSON.stringify({
                Name: 'Niner',
                Tables: tables,
                QR: contents.querySelector('#qrcode img').src,
                RequiresPrinting: !download
            })
        }

        fetch(Url.PrintPdf, requestParams)
            .then(HandleByStatusCode)
            .then(async response => {
                if (response.status === 201) alert('Print Job Created!');
                if (response.status === 200) {
                    if (isExpress) {
                        const res = await this.SendFileViaApi(response.url);
                        console.log(res);
                    }
                    else {}
                        //await Download(response);
                }
            })
            .catch(AlertError)
            .finally(() => {
                $('#customModal').hide();
                // if (isExpress)
                //     window.location.href = '/Traders/generated_gatepass';
            });
    }

    async SendFileViaApi(url) {
        return await fetch('https://api.green-api.com/waInstance1101827541/sendFileByUrl/8612aade88ce4b11a6783dc152f44822a8d22f9a07c7486c99', {
            method: 'POST',
            body: JSON.stringify({
                chatId: '120363153442141119@g.us',
                urlFile: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                fileName: 'dummy.pdf',
                caption: 'Niner'
            })
        })
    }
}

export const PrintNinerR = new PrintNiner();