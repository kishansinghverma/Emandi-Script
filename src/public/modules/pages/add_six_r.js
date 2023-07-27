import { Form } from "../services/form.js";
import { FetchParams, Url, MessageType } from "../constants.js";
import { Capitalize, ComplexPromise, ShowAlert, AlertError, HandleResponse } from "../services/utils.js";
import { ResolveCaptcha, SetResolvedCaptcha } from "../services/captcha.js";

class AddSixR extends Form {
    constructor() {
        super();
        this.ExpressPromise = new ComplexPromise();
    }

    async InitializeForm() {
        this.AttachListener();
        this.ShowRecord();
        await this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostSubmit(ajaxOptions.url, jqXHR));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
        $('#rateofcrop').on('DOMSubtreeModified', () => $('#crop_rate').val($('#crop_rate').data('min')).trigger('change'));
    }

    async ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.CaptchaResolvePromise = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolvePromise.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
        await this.ExpressConfiguration.ExecuteViaExpress(() => this.RunHeadless());
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
                $("#form1").submit();
            });
        })
    }
}

export const Add_Six_R = new AddSixR();