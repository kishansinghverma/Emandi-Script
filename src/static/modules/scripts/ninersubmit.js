import { Form } from "./form.js";

class NinerSubmit extends Form {
    InitializeForm() {
        this.RegisterListener();
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    RegisterListener() {
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        document.getElementById('submitbtn').setAttribute("onclick", "window.formContext.PreviewForm()");
        document.getElementById('crop_type').value = 'Mota';
        document.querySelector('input[type="checkbox"]').checked = true;
        document.querySelector('input[type="checkbox"]').dispatchEvent(new Event('click'));
        document.getElementById('in-captcha').addEventListener('change', ({target}) => this.AllowUpdate(target.value));
        this.ParseCaptcha('dntCaptchaImg', 'in-captcha');
    }

    UpdateForm() {
        document.getElementsByClassName('weights')[0].value = document.getElementsByClassName('Currentweights')[0].value;
        document.getElementsByClassName('weights')[0].dispatchEvent(new Event('change'));
        document.getElementById('rate').value = this.record.Rate;
        document.getElementById('rate').dispatchEvent(new Event('change'));
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm() {
        preview_data();
        
        fetch('https://automationfxapp.azurewebsites.net/emandi/update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SixrId: document.querySelector('.instrumentNumber').value
            })
        });
    }
}

export const NineRSubmit = new NinerSubmit();