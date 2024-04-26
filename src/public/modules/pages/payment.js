import { MessageType } from "../constants.js";
import { RecordHandler } from "../services/record.js";
import { showAlert } from "../services/utils.js";

class DigitalPayment {
    initializeForm = () => {
        this.attachListener();
        this.checkPendingPayments();
    }

    attachListener = () => $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.postAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));

    checkPendingPayments = () => {
        const columnCount = $('#datatable1 tbody tr td').length;
        if (columnCount === 1) this.notifyEmptyResponse();
        else if (columnCount > 1 && $('.chk').length > 0) this.submitForm();
    }

    submitForm = () => {
        //Implement a check if there are two entries
        $('.chk')[0].click();
        $('#proceddnow').click();
    }

    postAjaxCall = (url, response) => {
        if (url.includes('/Traders/Get6RListForPayment') && Array.isArray(response)) {
            if (response.length < 1) this.notifyEmptyResponse();
            else this.submitForm();
        }
    }

    notifyEmptyResponse = () => showAlert(MessageType.Info, 'No Payments Pending!', 5);
}

class GeneratedDigitalPayment {
    initializeForm = () => $('#Pay').click();
}

class PostSuccess {
    initializeForm = () => $('a.btn.btn-success')[0].click();
}

export const Digital_Payment = new DigitalPayment();
export const Generated_Digital_Payment = new GeneratedDigitalPayment();
export const Success = new PostSuccess();