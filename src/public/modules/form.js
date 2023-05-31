import { AlertError, HandleJsonResponse } from "./common.js";
import { Url } from "./constants.js";
import Tesseract from "../assets/tesseract.js";

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

    Capitalize(str) {
        const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return result.trim();
    }

    AllowUpdate(str) {
        if (str.length == 4) document.getElementById('updateBtn').removeAttribute('disabled');
        else document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }

    async ResolveCaptcha(source) {
        const canvas = document.createElement("canvas");
        canvas.width = 70;
        canvas.height = 40;
        canvas.getContext("2d").drawImage(document.getElementById(source), 0, 0);
        const image = document.createElement('img');
        image.src = canvas.toDataURL();
        const resolvedData = await Tesseract.recognize(image, 'eng', {});
        const parsedText = parseInt(resolvedData.data.text);
        if (isNaN(parsedText)) throw new Error('Captcha Not Parsed!');
        return parsedText;
    }

    SetResolvedCaptcha(value, target) {
        document.getElementById(target).value = value;
        document.getElementById(target).dispatchEvent(new Event('change'));
    }

    ParseCaptcha(source, target) {
        this.ResolveCaptcha(source).then(value => {
            this.SetResolvedCaptcha(value, target);
        }).catch(AlertError);
    }
}