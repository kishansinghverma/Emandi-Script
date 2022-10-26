import { Form } from "./common.js";

class NinerSubmit extends Form {
    InitializeForm() {
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    RegisterListener() {
        document.getElementById('cost').addEventListener('change', (event) => {
            document.getElementById('crop_type').value = 'Mota';
            document.getElementById('mandi_rate5').value = '0';
            document.getElementById('mandi_rate5').dispatchEvent(new Event('change'));
            document.getElementById('mandi_rate6').value = '0';
            document.getElementById('mandi_rate6').dispatchEvent(new Event('change'));
            document.getElementById('mandi_rate7').value = '0';
            document.getElementById('mandi_rate7').dispatchEvent(new Event('change'));
            document.getElementById('mandi_rate8').value = '0';
            document.getElementById('mandi_rate8').dispatchEvent(new Event('change'));
        });

        Object.defineProperty(document.getElementById('cost'), "value", {
            get: function () {
                return this.getAttribute('value');
            },
            set: function (val) {
                if (val && val != this.getAttribute('value')) {
                    this.dispatchEvent(new Event('change'));
                }
                this.setAttribute("value", val);
            }
        });

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
        //submitDetailsForm();
    }
}

export const NineRSubmit = new NinerSubmit();