import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";

class NinerSubmit extends Form {
    async InitializeForm() {
        await this.FetchRecord();
        this.record = window.formContext.record;
        this.AttachListener();
    }

    AttachListener() {
        const captcha = document.getElementById('dntCaptchaImg');
        if (!captcha) { alert("No Paid 6R found!"); this.HideModal(); return; }
        document.getElementById('img-captcha').append(captcha);
        document.querySelector('.finalSubmit').setAttribute("onclick", "window.formContext.SubmitForm()");
        document.getElementById('crop_type').value = 'Regular';
        document.querySelector('input[type="checkbox"]').checked = true;
        document.querySelector('input[type="checkbox"]').dispatchEvent(new Event('click'));
        document.getElementById('in-captcha').addEventListener('change', ({ target }) => this.AllowUpdate(target.value));
        this.ParseCaptcha('dntCaptchaImg', 'in-captcha');
    }

    UpdateForm() {
        document.getElementsByClassName('weights')[0].value = document.getElementsByClassName('Currentweights')[0].value;
        document.getElementsByClassName('weights')[0].dispatchEvent(new Event('change'));
        document.getElementById('rate').value = document.getElementById('cropminrate').value;
        document.getElementById('rate').dispatchEvent(new Event('change'));
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm = () => preview_data();

    SubmitForm() {
        submitDetailsForm();
        
        if (this.record)
            fetch(Url.UpdateRecord, {
                ...FetchParams.Post,
                body: JSON.stringify({ SixrId: document.querySelector('.instrumentNumber').value })
            }).then(HandleResponse).catch(AlertError);
    }
}

export const NineRSubmit = new NinerSubmit();