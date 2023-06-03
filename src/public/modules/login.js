import { AlertError } from "./common.js";
import { Form } from "./form.js";

class LoginForm extends Form {
    InitializeForm = () => {
        $('#userid').val("Kishanverma.guest@gmail.com");
        $('#pwd').val("Kishan@123");
        
        this.ResolveCaptcha('dntCaptchaImg')
            .then(text => {
                this.SetResolvedCaptcha(text, 'DNTCaptchaInputText');
                $('#btnsubmit').click();
            })
            .catch(AlertError);
    }
}

export const Login = new LoginForm();