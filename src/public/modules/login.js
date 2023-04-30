import { Form } from "./form.js";

class LoginForm extends Form {
    InitializeForm = () => this.ParseCaptcha('dntCaptchaImg', 'DNTCaptchaInputText');
}

export const Login = new LoginForm();