import { AlertError, HandleJsonResponse } from "./common.js";
import { Url } from "./constants.js";

export class Form {
    async FetchRecord() {
        await fetch(Url.PeekRecord)
            .then(HandleJsonResponse)
            .then(data => {
                window.formContext.record = data;
                document.getElementById('record').innerHTML = `<h4 onclick="window.formContext.SelectEntry()">${data.Seller}</h4>`;
            })
            .catch(err => {
                document.getElementById('record').innerHTML = '';
                if (err.code !== 204) AlertError(err);
            })
    }

    HideModal() {
        document.getElementById('customModal').style.display = 'none';
    }

    AllowUpdate(str) {
        if (str.length == 4) document.getElementById('updateBtn').removeAttribute('disabled');
        else document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }

    SetExpressConfig = () => localStorage.setItem('ExpressConfig', JSON.stringify({ IsExpress: true, Id: window.formContext.record.Id }));

    RemoveExpressConfig = () => localStorage.removeItem('ExpressConfig');

    TryExpressMode(executeExpress) {
        const expressConfig = JSON.parse(localStorage.getItem('ExpressConfig'));
        if (window.formContext?.record && expressConfig?.IsExpress) {
            if (expressConfig?.Id === window.formContext?.record?.Id) executeExpress();
            else console.log('Unable To Start In Express Mode!');
        }
    }
}