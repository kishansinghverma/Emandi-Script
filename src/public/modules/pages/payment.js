import { FetchParams, MessageType, Stages, Status, Url } from "../constants.js";
import { Form } from "../services/form.js";
import { ShowAlert, AlertError, FetchLastRecord, ShowLoader } from "../services/utils.js";
import { ExpressConfig } from "../services/express.js";

class DigitalPayment {
    InitializeForm() {
        this.AttachListener();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
    }

    PostAjaxCall(url, response) {
        if (url.includes('/Traders/Get6RListForPayment')) {
            if (Array.isArray(response)) {
                if (response.length < 1)
                    ShowAlert(MessageType.Info, 'No Payments Pending!', 3);
                else {
                    $('.chk')[0].click();
                    $('#proceddnow').click();
                }
            }
        }
    }
}

class GeneratedDigitalPayment {
    InitializeForm = () => document.getElementById('Pay').click();
}

class PostSuccess extends Form {
    InitializeForm = async () => {
        this.FetchRecord();

        try {
            ShowLoader('Fetching Details');
            const record = await FetchLastRecord('/Traders/GetDigitalPaymentList');
            const txnData = {
                cost: `${record.totalAmount}`,
                description: `7R/${record.sbirefno}`,
                details: this.Record ? `${this.Record.Party}, ${this.Record.Mandi}, ${this.Record.State}` : 'Manual'
            };
            ShowLoader('Saving Transaction')
            await fetch(Url.LogTransaction, { ...FetchParams.Post, body: JSON.stringify(txnData) });
        }
        catch (err) { AlertError(err) }
        finally {
            this.OnComplete();
            $('a.btn.btn-success')[0].click();
        }
    }

    OnComplete() {
        if (this.Configuration) {
            ExpressConfig.SetConfiguration({
                ...this.Configuration,
                Stage: Stages.NineR,
                Status: Status.Init
            });
        }
    }
}

export const Digital_Payment = new DigitalPayment();
export const Generated_Digital_Payment = new GeneratedDigitalPayment();
export const Success = new PostSuccess();