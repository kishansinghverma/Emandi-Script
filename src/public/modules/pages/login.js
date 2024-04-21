import { MessageType } from "../constants.js";
import { setResolvedCaptcha, validateCaptcha, resolveCaptcha } from "../services/captcha.js";
import { ComplexPromise, showAlert, alertError } from "../services/utils.js";

class LoginForm {
    initializeForm = () => {
        this.loginPromise = new ComplexPromise();
        this.registerListeners();
        this.executeInitialActions();
    }

    registerListeners() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.handleAjaxResponse(ajaxOptions, jqXHR));

        const observer = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList)
                if (mutation.addedNodes.length > 0)
                    $('#dntCaptchaImg').on('load', () => this.loginPromise.operator.then(() => this.login()));
        });

        observer.observe($('form > div:nth-child(3) .col-sm-10')[0], { childList: true });
    }

    executeInitialActions() {
        showAlert(MessageType.Info, 'Logging In<br>Please Wait...')
        $('#dntCaptchaRefreshButton').click();
        this.loginPromise.resolve();
    }

    login() {
        $('#userid').val("Kishanverma.guest@gmail.com");
        $('#pwd').val("Kishan@123");

        resolveCaptcha('dntCaptchaImg')
            .then(text => {
                setResolvedCaptcha(text, 'DNTCaptchaInputText');
                $('#btnsubmit').click();
            })
            .catch(alertError);
    }

    handleAjaxResponse(ajaxOptions, jqXHR) {
        if (ajaxOptions.url.includes('/Account'))
            validateCaptcha(jqXHR.responseJSON, true);
    }
}

export const Login = new LoginForm();