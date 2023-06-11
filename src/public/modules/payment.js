import { MessageType } from "./constants";
import { ShowAlert } from "./utils";

class DigitalPayment {
    InitializeForm() {
        this.AttachListener();
    }

    AttachListener() {
        let wait = setInterval(() => {
            if (document.querySelector('#datatable1 > tbody').childElementCount > 0) {
                clearInterval(wait);
                const requests = document.getElementsByClassName('chk');
                if (requests.length < 1) { ShowAlert(MessageType.Info, 'No Payments Pending!', 3); return };
                requests[0].click();
                document.getElementById('proceddnow').click();
            }
        }, 1000);
    }
}

class GeneratedDigitalPayment {
    InitializeForm = () => document.getElementById('Pay').click();
}

class PostSuccess {
    InitializeForm = () => $('a.btn.btn-success')[0].click();
}

export const Digital_Payment = new DigitalPayment();
export const Generated_Digital_Payment = new GeneratedDigitalPayment();
export const Success = new PostSuccess();