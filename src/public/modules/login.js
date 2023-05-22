import { AlertError } from "./common.js";
import { Form } from "./form.js";

class LoginForm extends Form {
    InitializeForm = () => {
        this.ResolveCaptcha('dntCaptchaImg')
            .then(text => {
                document.getElementById('userid').value = "Kishanverma.guest@gmail.com";
                document.getElementById('pwd').value = "Kishan@123";
                this.SetResolvedCaptcha(text, 'DNTCaptchaInputText');
                document.getElementById('btnsubmit').click();
            })
            .catch(AlertError);
    }
}

export const Login = new LoginForm();