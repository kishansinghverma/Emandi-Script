import { LoadingIcon } from "../assets.js";
import { Form } from "./form.js";

class PrintGatepass extends Form {
    InitializeForm() {
        fetch(`https://automationfxapp.azurewebsites.net/emandi/searchbygatepass?Id=${document.querySelector('#content > table.table.table-bordered > tbody > tr:nth-child(1) > td:nth-child(4) > label').innerHTML.trim()}`)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.status);
                return response.json();
            })
            .then(data => {
                document.getElementById('download').checked = data.Mode == "PDF";
                document.getElementById('download').dispatchEvent(new Event('change'));
            })
            .catch(() => {})
            .finally(() => {
                document.getElementById('record').innerHTML = '';
            });
    }

    Print(download) {
        var tables = []; var content = document.querySelector('body > div.row > #content');
        tables.push(content.querySelector('.table').outerHTML);
        tables.push(content.querySelector('.row .col-md-12 table').outerHTML);
        tables.push(content.querySelectorAll('.row .col-md-12 table')[1].outerHTML);
        tables.push(content.querySelectorAll('.row .col-md-12 .row')[0].outerHTML);
        var data = {
            'name': 'gatepass',
            'tables': tables,
            'qr': content.querySelector('#qrcode img').src,
            'download': download
        };
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () {
            if (xhttp.status != 201)
                alert(`Error ${xhttp.status}: ${xhttp.response}`);
            else {
                document.getElementById('customModal').style.display = 'none';

                if (download)
                    window.open('https://automationfxapp.azurewebsites.net/files/' + xhttp.response);
                else
                    setTimeout(() => { alert('Print Job Created!') }, 200);
            }
        };
        xhttp.open('POST', 'https://automationfxapp.azurewebsites.net/html', true);
        xhttp.setRequestHeader('Content-Type', 'application/json;');
        xhttp.send(JSON.stringify(data));
        document.getElementById('modalContent').innerHTML = `${LoadingIcon}<hr><div>Please Wait<div>`;
    }
}

export const PrintGatePass = new PrintGatepass();