import { MessageType } from "../constants.js";
import { setResolvedCaptcha, validateCaptcha, resolveCaptcha } from "../services/captcha.js";
import { ComplexPromise, showAlert, alertError } from "../services/utils.js";
import { BaseController } from "./base.js";

class LoginForm extends BaseController {
    constructor() {
        super();
        this.loginPromise = new ComplexPromise();
    }

    attachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.handleAjaxResponse(ajaxOptions, jqXHR));

        const observer = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList)
                if (mutation.addedNodes.length > 0)
                    $('#dntCaptchaImg').on('load', () => this.loginPromise.operator.then(() => {
                        resolveCaptcha('dntCaptchaImg')
                            .then(text => setResolvedCaptcha(text, 'DNTCaptchaInputText'))
                            .catch(alertError);
                    }));
        });

        observer.observe($('form > div:nth-child(3) .col-sm-10')[0], { childList: true });
    }

    async executeInitialActions() {
        showAlert(MessageType.Success, 'Script Ready...')
        $('#dntCaptchaRefreshButton').click();
        this.loginPromise.resolve();
    }

    updateForm() {
        // Form update is handled directly via mutations in Login form
    }

    submitForm() {
        // Submission handled by site UI usually, or triggers standard logic
    }

    handleAjaxResponse(ajaxOptions, jqXHR) {
        if (ajaxOptions.url.includes('/Account'))
            validateCaptcha(jqXHR.responseJSON, true);
    }
}

export const Login = new LoginForm();