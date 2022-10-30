import { Form } from "./form.js";

class NinerSubmit extends Form {
    InitializeForm() {
        this.RegisterListener();
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    RegisterListener() {
        document.getElementById('submitbtn').setAttribute("onclick", "window.formContext.PreviewForm()");
        document.getElementById('crop_type').value = 'Mota';
        document.querySelector('input[type="checkbox"]').checked = true;
        document.querySelector('input[type="checkbox"]').dispatchEvent(new Event('click'));
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
        fetch('https://automationfxapp.azurewebsites.net/emandi/update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                SixrId: document.querySelector('.instrumentNumber').value
            })
        });

        preview_data();
    }
}

export const NineRSubmit = new NinerSubmit();