import { MessageType } from "../constants.js";
import { Form } from "../services/form.js";
import { ShowAlert, AlertError } from "../services/utils.js";
import { ResolveCaptcha, SetResolvedCaptcha } from "../services/captcha.js";

class NinerSubmit extends Form {
    async InitializeForm() {
        if (this.IsNotReady()) return;
        this.AttachListener();
        await this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostSubmit(ajaxOptions.url, jqXHR));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
    }

    async ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        $('#crop_type').val('Regular');
        $('input[type="checkbox"]').first().click();

        this.CaptchaResolvePromise = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolvePromise.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);

        await this.ExpressConfiguration.ExecuteViaExpress(() => this.RunHeadless());
    }

    IsNotReady() {
        if (!$('#dntCaptchaImg')[0]) {
            ShowAlert(MessageType.Error, "No Paid 6R found!", 3);
            this.HideModal();
            return true;
        }
        return false;
    }

    UpdateForm() {
        $('.weights').first().val($('.Currentweights').first().val()).trigger('change');
        $('#rate').val($('#cropminrate').val()).trigger('change');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    PreviewForm() {
        this.RemoveExpressConfig();
        preview_data();
    }

    RedirectPage() {
        window.location.href = '/Traders/add_gatepass';
    }

    PostSubmit(url, jqXHR) {
        if (url === '/Traders/NineRSubmit') {
            // Reload the Page if parsed captcha is invalid.
            if (jqXHR?.responseJSON[0]?.status === 0) {
                if (jqXHR?.responseJSON[0]?.msg?.includes('Captcha')) {
                    ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
                    setTimeout(() => location.reload(), 1000);
                }
            }

            if (jqXHR?.responseJSON[0]?.status > 0) {
                ShowAlert(MessageType.Success, "Niner Created Successfully.");
                this.RedirectPage();
            }
        }
    }

    RunHeadless() {
        ShowAlert(MessageType.Info, 'Running In Express Mode...');
        this.CaptchaResolvePromise.then(() => {
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