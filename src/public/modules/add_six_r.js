import { Form } from "./form.js";
import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
class AddSixR extends Form {
    CaptchaResolvePromise;
    ExpressPromise;
    ResolveExpressPromise;

    constructor() {
        super();
        this.ExpressPromise = new Promise(resolve => { this.ResolveExpressPromise = resolve });
    }

    async InitializeForm() {
        await this.FetchRecord();
        this.record = window.formContext.record;
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostSubmit(ajaxOptions.url, jqXHR));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
        $('#rateofcrop').on('DOMSubtreeModified', () => $('#crop_rate').val($('#crop_rate').data('min')).trigger('change'));
    }

    ExecuteInitialActions() {
        if (this.record) $('#expressBtn').css('display', 'block');
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.CaptchaResolvePromise = this.ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolvePromise.then(value => this.SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
    }

    SelectEntry() {
        $('#sname').val(this.record.Seller);
        $('#quantity').val(this.record.Weight);
        $('#licence').val(this.record.PartyLicence ?? '');
    };

    UpdateForm() {
        $('#vikreta_details').val(this.Capitalize($('#sname').val()));
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

    PreviewForm() {
        this.RemoveExpressConfig();
        preview_data();
    }

    RedirectPage() {
        window.location.href = '/Traders/DigitalPayment';
    }

    PostSubmit(url, jqXHR) {
        if (url === 'https://emandi.up.gov.in/Traders/add_six_r') {
            if (jqXHR?.responseJSON[0]?.status > 0) {

                //Update the Rate in source record & redirect the page.
                if (this.record) {
                    fetch(Url.UpdateRecord, {
                        ...FetchParams.Post,
                        body: JSON.stringify({ Rate: $('#crop_rate').val() })
                    }).then(HandleResponse).catch(AlertError).finally(() => this.RedirectPage());
                }
                else this.RedirectPage();
            }
        }
    }

    RunHeadless() {
        this.SelectEntry();

        const timerId = setInterval(() => {
            if ($('#kreta_details').val()) {
                this.ResolveExpressPromise();
                clearInterval(timerId);
            }
        }, 500);

        this.CaptchaResolvePromise.then(() => {
            this.UpdateForm();
            this.ExpressPromise.then(() => {
                this.SetExpressConfig();
                $("#form1").submit();
            });
        })
    }
}

export const Add_Six_R = new AddSixR();