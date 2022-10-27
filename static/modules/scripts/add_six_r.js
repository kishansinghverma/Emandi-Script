import { Form } from "./common.js";

class AddSixR extends Form {
    InitializeForm() {
        this.AttachListener();
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        this.FetchRecord();
        this.record = window.formContext.record;
        this.ChangeEvent = new Event('change');
    }

    SelectEntry() {
        document.getElementById('sname').value = this.record.Seller;
        document.getElementById('quantity').value = this.record.Weight;
    };

    AttachListener() {
        document.getElementById('rateofcrop').addEventListener('DOMSubtreeModified', (event) => {
            document.getElementById('crop_rate').value = this.record.Rate;
            document.getElementById('crop_rate').dispatchEvent(this.ChangeEvent);
        });
    }

    UpdateForm() {
        document.getElementById('vikreta_details').value = this.Capitalize(document.getElementById('sname').value);
        document.getElementById('vikreta_mobile').value = '7037433280';
        document.getElementById('ForSelf').checked = true;
        document.getElementById('ForSelf').dispatchEvent(this.ChangeEvent);
        document.getElementById('crop_code').value = '58';
        document.getElementById('crop_code').dispatchEvent(this.ChangeEvent);
        document.getElementById('crop_type').value = 'Mota';
        document.getElementById('crop_weight').value = parseFloat(document.getElementById('quantity').value).toFixed(3);
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm() {
        preview_data();
    }
}

export const Add_Six_R = new AddSixR();