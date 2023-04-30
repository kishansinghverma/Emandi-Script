import { LoadingIcon } from "../assets/loader.js";
import { Download, HandleJsonResponse, HandleByStatusCode, AlertError } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";

class PrintGatepass extends Form {
    InitializeForm() {
        const ninerId = document.querySelector('#content > table.table.table-bordered > tbody > tr:nth-child(1) > td:nth-child(4) > label').innerHTML.trim();

        fetch(`${Url.GetByNineR}=${ninerId}`)
            .then(HandleJsonResponse)
            .then(data => {
                document.getElementById('download').checked = data.Mode == "PDF";
                document.getElementById('download').dispatchEvent(new Event('change'));
            })
            .catch(err => { if (err.code !== 204) AlertError(err) })
            .finally(() => { document.getElementById('record').innerHTML = '' });
    }

    Print(download) {
        document.getElementById('modalContent').innerHTML = `${LoadingIcon}<hr><div>Please Wait<div>`;
        const contents = document.querySelector('body > div.row > #content');

        const tables = [
            contents.querySelector('.table').outerHTML,
            contents.querySelector('.row .col-md-12 table').outerHTML,
            contents.querySelectorAll('.row .col-md-12 table')[1].outerHTML,
            contents.querySelectorAll('.row .col-md-12 .row')[0].outerHTML
        ];

        fetch(Url.PrintPdf, {
            ...FetchParams.Post,
            body: JSON.stringify({
                Name: 'Gatepass',
                Tables: tables,
                QR: contents.querySelector('#qrcode img').src,
                RequiresPrinting: !download
            })
        })
            .then(HandleByStatusCode)
            .then(response => {
                if (response.status === 201) alert('Print Job Created!');
                if (response.status === 200) Download(response);
            })
            .catch(AlertError)
            .finally(() => { document.getElementById('customModal').style.display = 'none' })
    }
}

export const PrintGatePass = new PrintGatepass();