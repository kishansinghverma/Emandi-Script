import { Form } from "./form.js";
import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";

class AddSixR extends Form {
    InitializeForm() {
        this.FetchRecord();
        this.AttachListener();
        this.record = window.formContext.record;
    }

    SelectEntry() {
        document.getElementById('sname').value = this.record.Seller;
        document.getElementById('quantity').value = this.record.Weight;
        if (this.record.PartyLicence)
            document.getElementById('licence').value = this.record.PartyLicence;
    };

    AttachListener() {
        document.querySelector('#model1 > div > div > div.modal-footer > button')?.click();
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        document.getElementById('submitbtn').setAttribute("onclick", "window.formContext.SubmitForm()");
        document.getElementById('rateofcrop').addEventListener('DOMSubtreeModified', (event) => {
            document.getElementById('crop_rate').value = $('#crop_rate').data('min');
            document.getElementById('crop_rate').dispatchEvent(new Event('change'));
        });
        document.getElementById('in-captcha').addEventListener('change', ({ target }) => this.AllowUpdate(target.value));
        this.ParseCaptcha('dntCaptchaImg', 'in-captcha');
    }

    UpdateForm() {
        const licenceNumber = document.getElementById('licence').value.trim();

        document.getElementById('vikreta_details').value = this.Capitalize(document.getElementById('sname').value);
        document.getElementById('vikreta_mobile').value = '7037433280';
        if (licenceNumber) {
            document.getElementById('trader_type').checked = true;
            document.getElementById('trader_type').dispatchEvent(new Event('change'));
            document.getElementById('kreta_license_number').value = licenceNumber;
            document.getElementById('kreta_license_number').dispatchEvent(new Event('change'));
        }
        else {
            document.getElementById('ForSelf').checked = true;
            document.getElementById('ForSelf').dispatchEvent(new Event('change'));
        }
        document.getElementById('crop_code').value = '58';
        document.getElementById('crop_code').dispatchEvent(new Event('change'));
        document.getElementById('crop_type').value = 'Mota';
        document.getElementById('crop_weight').value = parseFloat(document.getElementById('quantity').value).toFixed(3);
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm = () => preview_data();

    SubmitForm() {
        submitDetailsForm();
        if (this.record)
            fetch(Url.UpdateRecord, {
                ...FetchParams.Post,
                body: JSON.stringify({ Rate: document.getElementById('crop_rate').value })
            }).then(HandleResponse).catch(AlertError);
    }
}

export const Add_Six_R = new AddSixR();