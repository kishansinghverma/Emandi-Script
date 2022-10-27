import { Form } from "./common.js";

class GeneratedDigitalPayment extends Form {
    InitializeForm() {
        document.getElementById('Pay').click();
    }
}

export const Generated_Digital_Payment = new GeneratedDigitalPayment();