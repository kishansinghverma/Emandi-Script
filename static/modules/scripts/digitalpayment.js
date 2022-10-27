import { Form } from "./common.js";

class DigitalPayment extends Form {
    InitializeForm() {
        this.AttachListener();
    }

    AttachListener() {
        let wait = setInterval(() => {
            if (document.querySelector('#datatable1 > tbody').childElementCount > 0) {
                clearInterval(wait);
                if (document.getElementsByClassName('chk').length > 0) {
                    document.getElementsByClassName('chk')[0].click();
                    document.getElementById('proceddnow').click();
                }
                else 
                    alert('No Payment Pending')
            }
        }, 1000);
    }
}

export const Digital_Payment = new DigitalPayment();