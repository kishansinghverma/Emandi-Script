import { MessageType } from "../constants.js";
import { RecordHandler } from "../services/record.js";
import { showAlert } from "../services/utils.js";
import { BaseController } from "./base.js";

class DigitalPayment extends BaseController {
    async initializeForm() {
        await this.executeInitialActions();
        this.attachListener();
    }

    attachListener = () => $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.handleAjaxResponse(ajaxOptions, jqXHR?.responseJSON));

    async executeInitialActions() {
        this.checkPendingPayments();
    }

    checkPendingPayments = () => {
        const columnCount = $('#datatable1 tbody tr td').length;
        if (columnCount === 1) this.notifyEmptyResponse();
        else if (columnCount > 1 && $('.chk').length > 0) this.submitForm();
    }

    updateForm() {
        // Not used
    }

    submitForm = () => {
        //Implement a check if there are two entries
        $('.chk')[0].click();
        $('#proceddnow').click();
    }

    handleAjaxResponse(ajaxOptions, response) {
        const url = ajaxOptions.url;
        if (url.includes('/Traders/Get6RListForPayment') && Array.isArray(response)) {
            if (response.length < 1) this.notifyEmptyResponse();
            else this.submitForm();
        }
    }

    notifyEmptyResponse = () => showAlert(MessageType.Info, 'No Payments Pending!', 5);
}

class GeneratedDigitalPayment extends BaseController {
    async initializeForm() {
        await this.executeInitialActions();
    }
    async executeInitialActions() { $('#Pay').click(); }
    attachListener() {}
    updateForm() {}
    submitForm() {}
}

class PostSuccess extends BaseController {
    async initializeForm() {
        await this.executeInitialActions();
    }
    async executeInitialActions() { $('a.btn.btn-success')[0].click(); }
    attachListener() {}
    updateForm() {}
    submitForm() {}
}

export const Digital_Payment = new DigitalPayment();
export const Generated_Digital_Payment = new GeneratedDigitalPayment();
export const Success = new PostSuccess();