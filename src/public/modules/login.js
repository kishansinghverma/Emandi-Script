import { AlertError } from "./common.js";
import { Form } from "./form.js";

class LoginForm extends Form {
    InitializeForm = () => {
        this.ResolveCaptcha('dntCaptchaImg')
            .then(text => {
                $('#userid').val("Kishanverma.guest@gmail.com");
                $('#pwd').val("Kishan@123");
                this.SetResolvedCaptcha(text, 'DNTCaptchaInputText');
                $('#btnsubmit').click();
            })
            .catch(AlertError);
    }
}

export const Login = new LoginForm();