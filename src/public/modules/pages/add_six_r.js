import { Form } from "../services/form.js";
import { FetchParams, Url, MessageType, Stages, Status, StageMap } from "../constants.js";
import { Capitalize, ComplexPromise, ShowAlert, AlertError, HandleResponse } from "../services/utils.js";
import { ResolveCaptcha, SetResolvedCaptcha, ValidateCaptcha } from "../services/captcha.js";
import { ExpressConfig } from "../services/express.js";

class AddSixR extends Form {
    constructor() {
        super();
        this.LicenceFetcher = new ComplexPromise();
        this.RateFetcher = new ComplexPromise();
    }

    InitializeForm() {
        this.AttachListener();
        this.FetchRecord();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
    }

    ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.CaptchaResolver = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolver.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
        ExpressConfig.ExecuteViaExpress(() => this.RunHeadless());
    }

    SelectEntry() {
        $('#sname').val(this.Record.Seller);
        $('#quantity').val(this.Record.Weight);
        $('#licence').val(this.Record.PartyLicence ?? '');
    };

    UpdateForm() {
        $('#vikreta_details').val(Capitalize($('#sname').val()));
        $('#vikreta_mobile').val('7037433280');
        if ($('#licence').val()) {
            $('#trader_type').prop('checked', true).trigger('change');
            $('#kreta_license_number').val($('#licence').val()).trigger('change');
        }
        else
            $('#ForSelf').prop('checked', true).trigger('change');
        $('#crop_code').val('58').trigger('change');
        $('#crop_type').val('Regular');
        $('#crop_weight').val(parseFloat($('#quantity').val()).toFixed(3));
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    PreviewForm = () => preview_data();

    OnComplete() {
        if (this.Configuration) {
            ExpressConfig.SetConfiguration({
                ...this.Configuration,
                Stage: Stages.Payment,
                Status: Status.Init
            });
        }

        window.location.href = StageMap[Stages.Payment].Url;
    }

    PostAjaxCall(url, response) {
        if (Array.isArray(response) && response.length > 0) {
            // Resolves the Promise waiting for fetching Rate.
            if (url.includes('/Traders/get_crop_fees')) {
                $('#crop_rate').val(response[0].min_rate).trigger('change');
                this.RateFetcher.Resolve();
            }
            // Resolves the Promise waiting for Kreta Details. 
            else if (url.includes('/Traders/get_license_detail')) {
                this.LicenceFetcher.Resolve();
            }
            else if (url.includes('Traders/add_six_r')) {
                // Validate Captcha is correctly parsed.
                ValidateCaptcha(response);
                
                //Handles form submission
                if (response[0].status > 0) {
                    if (this.Record) {
                        const requestParams = { ...FetchParams.Post, body: JSON.stringify({ Rate: $('#crop_rate').val() }) };
                        fetch(Url.UpdateRecord, requestParams)
                            .then(HandleResponse)
                            .catch(AlertError)
                            .finally(() => this.OnComplete());
                    }
                    else this.OnComplete();
                }
            }
        }
    }

    RunHeadless() {
        this.CaptchaResolver.then(() => {
            this.SetInProgress();
            this.SelectEntry();
            this.UpdateForm();
            Promise.all([this.RateFetcher.Operator, this.LicenceFetcher.Operator]).then(() => {
                $("#form1").submit();
            })
        })
    }
}

export const Add_Six_R = new AddSixR();