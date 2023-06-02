import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";

class ComplexPromise {
    constructor(){
        this.Operator = new Promise((resolve, reject)=>{
            this.Resolve = resolve;
            this.Reject = reject;
        })
    }
};

class AddGatepass extends Form {
    constructor() {
        super();
        this.RemainingRequirements = ['Niner', 'Captcha'];
        this.ParentPromise = new ComplexPromise();
    }

    async InitializeForm() {
        await this.FetchRecord();
        this.record = window.formContext.record;
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.HandleAjaxResponse(ajaxOptions, jqXHR.responseJSON));
    }

    ResolveParentPromise(target) {
        if (target.Type === 'Niner') {
            if (Array.isArray(target.Response) && target.Response.length > 0)
                this.RemainingRequirements = this.RemainingRequirements.filter(item => (item != 'Niner'));
            else alert('No Paid 9R Found!');
        }
        if (target.Type === 'Captcha')
            this.RemainingRequirements = this.RemainingRequirements.filter(item => (item != 'Captcha'));

        if (this.RemainingRequirements.length === 0) this.ParentPromise.Resolve();
    }

    ExecuteInitialActions() {
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        // document.querySelector('div.modal-footer.text-center > a').setAttribute("onclick", "window.formContext.SubmitForm()");
        // document.getElementById('PaidType').value = document.getElementById('PaidType').options[1].value;
        // document.getElementById('PaidType').dispatchEvent(new Event('change'));

        this.ResolveCaptcha('dntCaptchaImg').then(text => {
            this.SetResolvedCaptcha(text, 'in-captcha');
            this.ResolveParentPromise({ Type: 'Captcha' });
        });

        this.ParentPromise.Operator.then(() => {
            alert("resolved");
            this.AllowUpdate($('#in-captcha'));
            $('#nine_r_id').val($('#nine_r_id option:eq(1)').val()).trigger('change');

        });
    }

    SelectEntry() {
        document.getElementById('destination').value = this.record.Mandi;
        document.getElementById('destination').dispatchEvent(new Event('change'));
        document.getElementById('carrier').value = this.record.Type;
        document.getElementById('carrier-no').value = this.record.VehicleNo;
        document.getElementById('packets').value = this.record.Packets;
        document.getElementById('statename').value = this.record.StateCode;
        document.getElementById('space').value = this.record.Distance;
        document.getElementById('mandiname').value = this.record.Mandi;
    };

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

        if (this.record)
            fetch(Url.UpdateRecord, {
                ...FetchParams.Post,
                body: JSON.stringify({ GatepassId: document.getElementById('transaction_number').value })
            })
                .then(HandleResponse)
                .catch(err => { if (err.code !== 204) AlertError(err) })
                .finally(() => fetch(Url.PopRecord)
                    .then(HandleResponse)
                    .catch(err => { if (err.code !== 204) AlertError(err) }));
    }

    HandleAjaxResponse(ajaxOptions, response) {
        //Handle fetching of Paid NineR(s).
        if (ajaxOptions.url === '/Traders/Bind9RDropDown') {
            if (ajaxOptions.data === 'ExportType=0&PaidType=1')
                this.ResolveParentPromise({ Type: 'Niner', Response: response });
        }


    }
}

export const Add_Gatepass = new AddGatepass();