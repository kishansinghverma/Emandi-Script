import { Form } from "./form.js";
import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url, MessageType } from "./constants.js";
import { Capitalize, ComplexPromise, ResolveCaptcha, SetResolvedCaptcha, ShowAlert } from "./utils.js";

class AddSixR extends Form {
    constructor() {
        super();
        this.ExpressPromise = new ComplexPromise();
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

        this.CaptchaResolvePromise = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolvePromise.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
    }

    SelectEntry() {
        $('#sname').val(this.record.Seller);
        $('#quantity').val(this.record.Weight);
        $('#licence').val(this.record.PartyLicence ?? '');
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

    PreviewForm() {
        this.RemoveExpressConfig();
        preview_data();
    }

    RedirectPage() {
        window.location.href = '/Traders/DigitalPayment';
    }

    PostSubmit(url, jqXHR) {
        if (url === 'https://emandi.up.gov.in/Traders/add_six_r') {
            // Reload the Page if parsed captcha is invalid. 
            if (jqXHR?.responseJSON[0]?.status === 0) {
                if (jqXHR?.responseJSON[0]?.msg?.includes('Captcha')) {
                    ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
                    setTimeout(() => location.reload(), 1000);
                }
            }

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
        ShowAlert(MessageType.Info, 'Running In Express Mode...');
        const timerId = setInterval(() => {
            if ($('#kreta_details').val()) {
                this.ExpressPromise.Resolve();
                clearInterval(timerId);
            }
        }, 500);

        this.CaptchaResolvePromise.then(() => {
            this.SelectEntry();
            this.UpdateForm();

            this.ExpressPromise.Operator.then(() => {
                this.SetExpressConfig();
                $("#form1").submit();
            });
        })
    }
}

export const Add_Six_R = new AddSixR();