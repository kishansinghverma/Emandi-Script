import { MessageType, StageMap, Stages, Status } from "../constants.js";
import { Form } from "../services/form.js";
import { ShowAlert, AlertError } from "../services/utils.js";
import { ResolveCaptcha, SetResolvedCaptcha } from "../services/captcha.js";
import { ExpressConfig } from "../services/express.js";

class NinerSubmit extends Form {
    InitializeForm() {
        this.CheckPaidSixR();
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
    }

    ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        $('#crop_type').val('Regular');
        $('input[type="checkbox"]').first().click();
        this.CaptchaResolver = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolver.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
        
        if(this.Configuration) ExpressConfig.SetConfiguration({ ...this.Configuration, Status: Status.Init });
        ExpressConfig.ExecuteViaExpress(() => this.RunHeadless());
    }

    CheckPaidSixR() {
        if (!$('#dntCaptchaImg')[0]) {
            ShowAlert(MessageType.Error, "No Paid 6R found!", 3);
            $('#customModal').hide();
            throw new Error('No Paid 6R found!');
        }
    }

    UpdateForm() {
        $('.weights').first().val($('.Currentweights').first().val()).trigger('change');
        $('#rate').val($('#cropminrate').val()).trigger('change');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    PreviewForm = () => preview_data();

    OnComplete() {
        if (this.Configuration) {
            ExpressConfig.SetConfiguration({
                ...this.Configuration,
                Stage: Stages.Gatepass,
                Status: Status.Init
            });
        }

        window.location.href = StageMap[Stages.Gatepass].Url;
    }

    PostAjaxCall(url, response) {
        if (Array.isArray(response) && response.length > 0) {
            if (url.includes('/Traders/NineRSubmit')) {
                // Reload the Page if parsed captcha is invalid.
                if (response[0].status === 0 && response[0].msg?.includes('Captcha')) {
                    ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
                    setTimeout(() => location.reload(), 1000);
                }

                else if (response[0].status > 0) {
                    ShowAlert(MessageType.Success, "Niner Created Successfully.");
                    this.OnComplete();
                }
            }
        }

    }

    RunHeadless() {
        this.CaptchaResolver.then(() => {
            this.UpdateForm();
            $('#loader').show();
            $.ajax({
                url: $("#form1").attr("action"),
                method: "post",
                data: $('#form1').serialize(),
                async: false
            });
            $('#loader').hide();
        })
    }
}

export const NineRSubmit = new NinerSubmit();