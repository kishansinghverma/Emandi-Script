import { AlertError } from "./common.js";
import { FetchParams, MessageType, Url } from "./constants.js";
import { Form } from "./form.js";
import { FetchLastRecord, ShowAlert } from "./utils.js";

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

class PostSuccess extends Form {
    InitializeForm = async () => {
        await this.FetchRecord();
        this.record = window.formContext.record;

        try {
            const record = await FetchLastRecord('/Traders/GetDigitalPaymentList');
            const txnData = {
                cost: `${record.totalAmount}`,
                description: `Gatepass/${record.sbirefno}`,
                details: this.record ? `${this.record.Party}, ${this.record.Mandi}, ${this.record.State}` : 'Manual'
            };
            $('#loader').show();
            await fetch(Url.LogTransaction, { ...FetchParams.Post, body: JSON.stringify(txnData) });
        }
        catch (err) { AlertError(err) }
        finally { $('a.btn.btn-success')[0].click(); }
    }
}

export const Digital_Payment = new DigitalPayment();
export const Generated_Digital_Payment = new GeneratedDigitalPayment();
export const Success = new PostSuccess();