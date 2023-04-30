import { Form } from "./form.js";

class DigitalPayment extends Form {
    InitializeForm() {
        this.AttachListener();
    }

    AttachListener() {
        let wait = setInterval(() => {
            if (document.querySelector('#datatable1 > tbody').childElementCount > 0) {
                clearInterval(wait);
                const requests = document.getElementsByClassName('chk');
                if (requests.length < 1) { alert('No Payments Pending!'); return };
                requests[0].click();
                document.getElementById('proceddnow').click();
            }
        }, 1000);
    }
}

export const Digital_Payment = new DigitalPayment();