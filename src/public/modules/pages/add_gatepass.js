import { FetchParams, MessageType, Url } from "../constants.js";
import { onResolved, resolveCaptcha, setResolvedCaptcha, validateCaptcha } from "../services/captcha.js";
import { RecordHandler } from "../services/record.js";
import { ComplexPromise, alertError, capitalize, hideLoader, hideModal, showAlert, showLoader, validateResponse } from "../services/utils.js";
import { printLastReciepts } from "../services/print.js"

class AddGatepass extends RecordHandler {
    constructor() {
        super();
        this.formReady = new ComplexPromise();
    }

    initializeForm = async () => {
        this.attachListener();
        this.executeInitialActions();
    }

    attachListener = () => {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.handleAjaxResponse(ajaxOptions, jqXHR?.responseJSON));
        this.formReady.operator.then(() => {
            if ($('#in-captcha').val().length === 4) onResolved($('#in-captcha').val());
            else $('#in-captcha').on('input', ({ target }) => onResolved(target.value));
        });
        $('#submit-btn').click(this.submitForm);
    }

    executeInitialActions = () => {
        this.checkPaidType();
        $('#img-captcha').append($('#dntCaptchaImg'));
        resolveCaptcha('dntCaptchaImg').then(value => setResolvedCaptcha(value, 'in-captcha')).catch(alertError);
        this.renderRecord();
    }

    checkPaidType = () => { if ($('#nine_r_id option').length > 0) this.selectPaidType() };

    selectPaidType = () => $('#PaidType').val($('#PaidType option:eq(1)').val()).trigger('change');

    selectNiner = () => $('#nine_r_id').val($('#nine_r_id option:eq(1)').val()).trigger('change');

    updateForm = () => {
        $('#dist_ofdestination').val($('#space').val());
        $('#home_center').val(capitalize($('#destination').val()));
        $('#vehicle').val($('#carrier').val()).trigger('change');
        $('#vehicle_no').val($('#carrier-no').val().toUpperCase());
        $('#bundle_no').val($('#packets').val());
        $('#state').val($('#statename').val()).trigger('change');
        $('#other_state_mandi').val($('#mandiname').val()).trigger('change');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
    }

    submitForm = () => {
        this.updateForm();
        if ($('#form1').valid()) this.record ? $("#form1").submit() : preview_data();
        else alertError('Check the required fields!');
    }

    postComplete = () => {
        showAlert(MessageType.Success, "Process Completed&emsp;🎉");
        location.href = "/Traders/Dashboard";
    }

    onComplete = async () => {
        hideModal();
        setTimeout(() => $('.swal-overlay').hide(), 200);
        showAlert(MessageType.Success, "Gatepass Created Successfully.", 3);
        await printLastReciepts(false, false, this.record?.driverMobile);
        if (this.record) {
            showLoader('Finalizing Record...');
            await fetch(Url.UpdateRecord, {
                ...FetchParams.Patch,
                body: JSON.stringify({ rate: this.record.rate ?? 0, finalize: true })
            }).then(validateResponse)
                .then(this.removeRecord)
                .then(this.postComplete)
                .catch(alertError)
                .finally(hideLoader);
        } else this.postComplete();
    }

    handleAjaxResponse(option, response) {
        if (Array.isArray(response)) {
            if (option.url.includes('/Traders/BindStateList'))
                this.formReady.resolve();
            else if (option.url.includes('/Traders/Bind9RDropDown')) {
                //Handle fetching of Unpaid NineR(s).
                if (option.data.includes('ExportType=0&PaidType=0')) this.selectPaidType();
                //Handle fetching of Paid NineR(s).
                else if (option.data.includes('ExportType=0&PaidType=1'))
                    (response.length > 0) ? this.selectNiner() : showAlert(MessageType.Error, 'No Paid 9R Found!', 5);
            }
            else if (option.url.includes('/Traders/add_gatepass')) {
                // Validate Captcha is correctly parsed.
                validateCaptcha(response);
                // Handles Form Submission
                if (response[0].status > 0) this.onComplete();
            }
        }
    }
}

export const Add_Gatepass = new AddGatepass();