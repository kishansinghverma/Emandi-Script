import { MessageType } from "../constants.js";
import { Form } from "../services/form.js";
import { ResolveCaptcha, SetResolvedCaptcha } from "../services/captcha.js";
import { ComplexPromise, ShowAlert, AlertError } from "../services/utils.js";

class LoginForm extends Form {
    InitializeForm = () => {
        this.LoginPromise = new ComplexPromise();
        this.RegisterListeners();
        this.ExecuteInitialActions();
    }

    RegisterListeners() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.HandleAjaxResponse(ajaxOptions, jqXHR));

        const observer = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList)
                if (mutation.addedNodes.length > 0)
                    $('#dntCaptchaImg').on('load', () => this.LoginPromise.Operator.then(() => this.Login()));
        });

        observer.observe($('form > div:nth-child(3) .col-sm-10')[0], { childList: true });
    }

    ExecuteInitialActions() {
        ShowAlert(MessageType.Info, 'Logging In, Please Wait...', 5);
        $('#dntCaptchaRefreshButton').click();
        this.LoginPromise.Resolve();
    }

    Login() {
        $('#userid').val("Kishanverma.guest@gmail.com");
        $('#pwd').val("Kishan@123");

        ResolveCaptcha('dntCaptchaImg')
            .then(text => {
                SetResolvedCaptcha(text, 'DNTCaptchaInputText');
                $('#btnsubmit').click();
            })
            .catch(AlertError);
    }

    HandleAjaxResponse(ajaxOptions, jqXHR) {
        if (ajaxOptions.url === 'https://emandi.up.gov.in/Account') {
            if (!jqXHR.responseJSON.succeeded) {
                ShowAlert(MessageType.Error, 'Invalid Captcha! Reloading...');
                setTimeout(() => location.reload(), 1000);
            }
        }
    }
}

export const Login = new LoginForm();