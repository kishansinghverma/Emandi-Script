import { AlertError, HandleJsonResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";

class AddGatepass extends Form {
    InitializeForm() {
        this.AttachListener();
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    SelectEntry() {
        document.getElementById('destination').value = this.record.Mandi;
        document.getElementById('destination').dispatchEvent(new Event('change'));
        document.getElementById('carrier').value = this.record.Type;
        document.getElementById('carrier-no').value = this.record.VehicleNo;
        document.getElementById('packets').value = this.record.Packets;
        document.getElementById('statename').value = this.record.State?.Code;
        document.getElementById('space').value = this.record.Distance;
        document.getElementById('mandiname').value = this.record.Mandi;
    };

    AttachListener() {
        const resolvedCaptcha = this.ResolveCaptcha('dntCaptchaImg');
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        document.querySelector('div.modal-footer.text-center > a').setAttribute("onclick", "window.formContext.SubmitForm()");
        document.getElementById('PaidType').value = document.getElementById('PaidType').options[1].value;
        document.getElementById('PaidType').dispatchEvent(new Event('change'));
        document.getElementById('in-captcha').addEventListener('change', ({ target }) => this.AllowUpdate(target.value));
        const wait = setInterval(() => {
            if (document.getElementById('nine_r_id').options.length > 1) {
                document.getElementById('nine_r_id').value = document.getElementById('nine_r_id').options[1].value;
                document.getElementById('nine_r_id').dispatchEvent(new Event('change'));
                this.SetResolvedCaptcha(resolvedCaptcha, 'in-captcha');
                clearInterval(wait);
            }
        }, 1000);
    }

    UpdateForm() {
        document.getElementById('dist_ofdestination').value = document.getElementById('space').value;
        document.getElementById('home_center').value = this.Capitalize(document.getElementById('destination').value);
        document.getElementById('vehicle').value = document.getElementById('carrier').value;
        document.getElementById('vehicle').dispatchEvent(new Event('change'));
        document.getElementById('vehicle_no').value = document.getElementById('carrier-no').value.toUpperCase();
        document.getElementById('bundle_no').value = document.getElementById('packets').value;
        document.getElementById('state').value = document.getElementById('statename').value;
        document.getElementById('state').dispatchEvent(new Event('change'));
        document.getElementById('other_state_mandi').value = document.getElementById('mandiname').value;
        document.getElementById('other_state_mandi').dispatchEvent(new Event('change'));
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm = () => preview_data();

    SubmitForm() {
        submitDetailsForm();


        fetch(Url.UpdateRecord, {
            ...FetchParams.Post,
            body: JSON.stringify({ GatepassId: document.getElementById('transaction_number').value })
        })
            .then(HandleJsonResponse)
            .catch(err => { if (err.code !== 204) AlertError(err) })
            .finally(() => fetch(Url.PopRecord)
                .then(HandleJsonResponse)
                .catch(err => { if (err.code !== 204) AlertError(err) }));
    }
}

export const Add_Gatepass = new AddGatepass();