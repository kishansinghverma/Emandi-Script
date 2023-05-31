import { AlertError, HandleResponse } from "./common.js";
import { FetchParams, Url } from "./constants.js";
import { Form } from "./form.js";

class NinerSubmit extends Form {
    CaptchaResolvePromise;

    async InitializeForm() {
        await this.FetchRecord();
        this.record = window.formContext.record;
        if (this.IsNotReady()) return;
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostSubmit(ajaxOptions.url, jqXHR));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
        this.CaptchaResolvePromise = this.ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolvePromise.then(value => this.SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);
    }

    ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        $('#crop_type').val('Regular');
        $('input[type="checkbox"]').click();

        const expressConfig = JSON.parse(localStorage.getItem('ExpressConfig'));
        if (this.record && expressConfig?.IsExpress) {
            if (expressConfig?.Id === this.record.Id) this.RunHeadless();
            else alert('Unable To Start In Express Mode!');
        }
    }

    IsNotReady() {
        if (!$('#dntCaptchaImg')[0]) {
            alert("No Paid 6R found!");
            this.HideModal();
            return true;
        }
        return false;
    }

    UpdateForm() {
        document.getElementsByClassName('weights')[0].value = document.getElementsByClassName('Currentweights')[0].value;
        document.getElementsByClassName('weights')[0].dispatchEvent(new Event('change'));
        document.getElementById('rate').value = document.getElementById('cropminrate').value;
        document.getElementById('rate').dispatchEvent(new Event('change'));
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
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
            if (jqXHR?.responseJSON[0]?.status > 0) {

                //Update the NinerR number in source record.
                if (this.record)
                    fetch(Url.UpdateRecord, {
                        ...FetchParams.Post,
                        body: JSON.stringify({ SixrId: $('.instrumentNumber').val() })
                    }).then(HandleResponse).catch(AlertError).finally(() => this.RedirectPage());

                else this.RedirectPage();
            }
        }

    }

    RunHeadless() {
        this.CaptchaResolvePromise.then(() => {
            this.UpdateForm();

            $.ajax({
                url: $("#form1").attr("action"),
                method: "post",
                data: $('#form1').serialize()
            });
        })
    }
}

export const NineRSubmit = new NinerSubmit();