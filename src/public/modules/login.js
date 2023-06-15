import { AlertError } from "./common.js";
import { MessageType } from "./constants.js";
import { Form } from "./form.js";
import { ResolveCaptcha, SetResolvedCaptcha, ShowAlert } from "./utils.js";

class LoginForm extends Form {
    InitializeForm = () => {
        ShowAlert(MessageType.Info, 'Logging In, Please Wait...', 5);
        this.ParseCaptcha();
        this.RegisterListeners();
    }

    RegisterListeners() {
        const targetNode = document.querySelector('form > div:nth-child(3) .col-sm-10');
        const config = { childList: true };
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                this.ParseCaptcha();
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    ParseCaptcha() {
        this.Source = $('#dntCaptchaImg').attr('src');
        $('#userid').val("Kishanverma.guest@gmail.com");
        $('#pwd').val("Kishan@123");

        ResolveCaptcha('dntCaptchaImg')
            .then(text => {
                if (this.Source === $('#dntCaptchaImg').attr('src')) {
                    SetResolvedCaptcha(text, 'DNTCaptchaInputText');
                    $('#btnsubmit').click();
                }
                else this.ParseCaptcha();
            })
            .catch(AlertError);
    }
}

export const Login = new LoginForm();