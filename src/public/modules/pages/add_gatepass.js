// import { AlertError, HandleResponse, Capitalize, ComplexPromise, showAlert, showLoader } from "../services/utils.js";
// import { MessageType, Url } from "../constants.js";
import { Form } from "../services/form.js";
import { ComplexPromise } from "../services/utils.js";
// import { ResolveCaptcha, SetResolvedCaptcha, ValidateCaptcha } from "../services/captcha.js";
// import { ExpressConfig } from "../services/record.js";
// import { PrintLastReciepts } from "../services/print.js";

class AddGatepass extends Form {
    constructor() {
        super();
        this.NinerFetcher = new ComplexPromise();
    }

    InitializeForm() {
        this.FetchRecord();
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.HandleAjaxResponse(ajaxOptions, jqXHR?.responseJSON));
    }

    ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        setTimeout(() => $('#PaidType').val($('#PaidType option:eq(1)').val()).trigger('change'), 2000);

        this.CaptchaResolver = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolver.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);

        Promise.all([this.CaptchaResolver, this.NinerFetcher.Operator]).then(() => {
            this.AllowUpdate($('#in-captcha').val());
            $('#nine_r_id').val($('#nine_r_id option:eq(1)').val()).trigger('change');
        });

        ExpressConfig.ExecuteViaExpress(() => this.RunHeadless());
    }

    SelectEntry() {
        $('#destination').val(this.Record.Mandi).trigger('change');
        $('#carrier').val(this.Record.Type);
        $('#carrier-no').val(this.Record.VehicleNo);
        $('#packets').val(this.Record.Packets);
        $('#statename').val(this.Record.StateCode);
        $('#space').val(this.Record.Distance);
        $('#mandiname').val(this.Record.Mandi);
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

    OnComplete = (extraRecipient) => {
        PrintLastReciepts(false, extraRecipient).catch(AlertError).finally(() => {
            ExpressConfig.RemoveConfiguration();
            window.location.href = '/Traders/Dashboard';
        })
    }

    HandleAjaxResponse(option, response) {
        if (Array.isArray(response)) {
            //Handle fetching of Paid NineR(s).
            if (option.url.includes('/Traders/Bind9RDropDown') && option.data.includes('ExportType=0&PaidType=1')) {
                console.log(response);
                if (response.length > 0) {
                    $("#nine_r_id").html('<option style="font-weight:bold;" value="">Select 6R/ES/P</option>');
                    response.forEach(item => $("#nine_r_id").append(`<option value="${item.id}">${item.id}</option>`))
                    this.NinerFetcher.Resolve();
                }
                else showAlert(MessageType.Error, 'No Paid 9R Found!', 3);
            }
            else if (option.url.includes('/Traders/add_gatepass')) {
                // Validate Captcha is correctly parsed.
                ValidateCaptcha(response);

                // Handles Form Submission
                if (response[0].status > 0) {
                    showAlert(MessageType.Success, "Gatepass Created Successfully.", 3);
                    setTimeout(() => {
                        $('.swal-overlay').hide();
                        $('#customModal').hide();
                        showLoader('Finalizing Record...');

                        if (this.Record) {
                            fetch(Url.PopRecord)
                                .then(HandleResponse)
                                .catch(err => { if (err.code !== 204) AlertError(err) })
                                .finally(() => this.OnComplete(this.Record.Recipient));
                        }
                        else this.OnComplete();
                    }, 100);
                }
            }
        }
    }

    RunHeadless() {
        Promise.all([this.CaptchaResolver, this.NinerFetcher.Operator]).then(() => {
            this.SetInProgress();
            this.SelectEntry();
            setTimeout(() => {
                this.UpdateForm();
                $("#form1").submit();
            }, 1000);
        })
    }
}

export const Add_Gatepass = new AddGatepass();