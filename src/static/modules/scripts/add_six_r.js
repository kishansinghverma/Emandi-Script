import { Form } from "./form.js";

class AddSixR extends Form {
    InitializeForm() {
        this.FetchRecord();
        this.AttachListener();
        this.record = window.formContext.record;
    }

    SelectEntry() {
        document.getElementById('sname').value = this.record.Seller;
        document.getElementById('quantity').value = this.record.Weight;
    };

    AttachListener() {
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        document.getElementById('submit').setAttribute("onclick", "window.formContext.PreviewForm()");
        document.getElementById('rateofcrop').addEventListener('DOMSubtreeModified', (event) => {
            document.getElementById('crop_rate').value = this.record.Rate;
            document.getElementById('crop_rate').dispatchEvent(new Event('change'));
        });

        document.getElementById('in-captcha').addEventListener('change', ({ target }) => this.AllowUpdate(target.value));
        this.ParseCaptcha('dntCaptchaImg', 'in-captcha');
    }

    UpdateForm() {
        document.getElementById('vikreta_details').value = this.Capitalize(document.getElementById('sname').value);
        document.getElementById('vikreta_mobile').value = '7037433280';
        document.getElementById('ForSelf').checked = true;
        document.getElementById('ForSelf').dispatchEvent(new Event('change'));
        document.getElementById('crop_code').value = '58';
        document.getElementById('crop_code').dispatchEvent(new Event('change'));
        document.getElementById('crop_type').value = 'Mota';
        document.getElementById('crop_weight').value = parseFloat(document.getElementById('quantity').value).toFixed(3);
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm() {
        preview_data();

        if (this.record.Rate != document.getElementById('crop_rate').value) {
            
            //Update the rate on the current record.
            if (this.record.Id)
                fetch('https://automationfxapp.azurewebsites.net/emandi/update', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Rate: document.getElementById('crop_rate').value
                    })
                }).catch(() => { });

            //Set the rate for upcoming records.
            fetch('https://automationfxapp.azurewebsites.net/emandi/rate', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Rate: document.getElementById('crop_rate').value
                })
            }).then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
            }).catch(err => { alert(err.message) });
        }
    }
}

export const Add_Six_R = new AddSixR();