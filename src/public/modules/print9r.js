import { LoadingIcon } from "../assets/loader.js";
import { Form } from "./form.js";
import { FetchParams, Url } from "./constants.js";
import { AlertError, Download, HandleByStatusCode, HandleJsonResponse } from "./common.js";

class PrintNiner extends Form {
    InitializeForm() {
        const sixrId = document.querySelector('#tab_logic > tbody > tr > td:nth-child(8) > label').innerHTML.trim();
        fetch(`${Url.GetBySixR}=${sixrId}`)
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
            contents.querySelector('.row .col-md-12 table').outerHTML
        ];

        fetch(Url.PrintPdf, {
            ...FetchParams.Post,
            body: JSON.stringify({
                Name: 'Niner',
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

export const PrintNinerR = new PrintNiner();