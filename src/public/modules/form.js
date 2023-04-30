import { AlertError, HandleJsonResponse } from "./common.js";
import { Url } from "./constants.js";
import Tesseract from "../assets/tesseract.js";

export class Form {
    FetchRecord() {
        fetch(Url.PeekRecord)
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

    Capitalize(str) {
        const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return result.trim();
    }

    AllowUpdate(str) {
        if (str.length == 4) document.getElementById('updateBtn').removeAttribute('disabled');
        else document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }

    ResolveCaptcha(source) {
        var canvas = document.createElement("canvas");
        canvas.width = 70;
        canvas.height = 40;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(document.getElementById(source), 0, 0);
        const base64String = canvas.toDataURL();
        const image = document.createElement('img');
        image.src = base64String;

        return new Promise((resolve, reject) => {
            Tesseract.recognize(image, 'eng', {})
                .then(({ data: { text } }) => {
                    if (isNaN(text)) throw new Error('Captcha Not Parsed!');
                    resolve(text);
                }).catch(reject);
        })
    }

    SetResolvedCaptcha(value, target) {
        value.then(text => {
            document.getElementById(target).value = text;
            document.getElementById(target).dispatchEvent(new Event('change'));
        }).catch(AlertError);
    }

    ParseCaptcha(source, target) {
        this.ResolveCaptcha(source).then(text => {
            document.getElementById(target).value = text;
            document.getElementById(target).dispatchEvent(new Event('change'));
        }).catch(AlertError);
    }
}