import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";
import { Capitalize, ComplexPromise, ResolveCaptcha, SetResolvedCaptcha } from "./utils.js";

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
        $('#img-captcha').append($('#dntCaptchaImg'));
        $('#PaidType').val($('#PaidType option:eq(1)').val()).trigger('change');

        ResolveCaptcha('dntCaptchaImg').then(text => {
            SetResolvedCaptcha(text, 'in-captcha');
            this.ResolveParentPromise({ Type: 'Captcha' });
        });

        this.ParentPromise.Operator.then(() => {
            this.AllowUpdate($('#in-captcha').val());
            $('#nine_r_id').val($('#nine_r_id option:eq(1)').val()).trigger('change');
        });

        this.TryExpressMode(() => this.RunHeadless());
    }

    SelectEntry() {
        $('#destination').val(this.record.Mandi).trigger('change');
        $('#carrier').val(this.record.Type);
        $('#carrier-no').val(this.record.VehicleNo);
        $('#packets').val(this.record.Packets);
        $('#statename').val(this.record.StateCode);
        $('#space').val(this.record.Distance);
        $('#mandiname').val(this.record.Mandi);
    };

    UpdateForm() {
        $('#dist_ofdestination').val($('#space').val());
        $('#home_center').val(Capitalize($('#destination').val()));
        $('#vehicle').val($('#carrier').val()).trigger('change');
        $('#vehicle_no').val($('#carrier-no').val().toUpperCase());
        $('#bundle_no').val($('#packets').val());
        $('#state').val($('#statename').val()).trigger('change');
        $('#other_state_mandi').val($('#mandiname').val()).trigger('change');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    PreviewForm = () => preview_data();

    RedirectPage() {
        window.location.href = '/Traders/generated_gatepass';
    }

    HandleAjaxResponse(ajaxOptions, response) {
        //Handle fetching of Paid NineR(s).
        if (ajaxOptions.url === '/Traders/Bind9RDropDown') {
            if (ajaxOptions.data === 'ExportType=0&PaidType=1')
                this.ResolveParentPromise({ Type: 'Niner', Response: response });
        }

        //Handle form submission.
        if (ajaxOptions.url === 'https://emandi.up.gov.in/Traders/add_gatepass') {
            // Reload the Page if parsed captcha is invalid.
            if (jqXHR?.responseJSON[0]?.status === 0) {
                if (jqXHR?.responseJSON[0]?.msg?.includes('Captcha')) {
                    ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
                    setTimeout(() => location.reload(), 1000);
                }
            }

            // Handle form submit.
            if (jqXHR[0]?.status > 0) {
                if (this.record) {
                    const requestData = {
                        ...FetchParams.Post,
                        body: JSON.stringify({
                            GatepassId: $('#transaction_number').val(),
                            Finalize: true
                        })
                    };

                    fetch(Url.UpdateRecord, requestData)
                        .then(HandleResponse)
                        .catch(err => { if (err.code !== 204) AlertError(err) })
                        .finally(() => {
                            this.RemoveExpressConfig();
                            this.RedirectPage();
                        });
                }
                else this.RedirectPage();
            }
        }
    }

    RunHeadless() {
        ShowAlert(MessageType.Info, 'Running In Express Mode...');
        this.ParentPromise.Operator.then(() => {
            this.SelectEntry();
            this.UpdateForm();
            $("#form1").submit();
            localStorage.setItem('ExpressPrint', 'true');
        })
    }
}

export const Add_Gatepass = new AddGatepass();