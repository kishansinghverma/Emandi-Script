import { MessageType } from "../constants.js";
import { onResolved, resolveCaptcha, setResolvedCaptcha, validateCaptcha } from "../services/captcha.js";
import { RecordHandler } from "../services/record.js";
import { ComplexPromise, alertError, capitalize, fetchLastRecord, showAlert } from "../services/utils.js";

class AddGatepass extends RecordHandler {
    constructor() {
        super();
        this.formReady = new ComplexPromise();
    }

    initializeForm = async () => {
        console.log((await fetchLastRecord('/Traders/GetDigitalPaymentList')));
        this.attachListener();
        this.executeInitialActions();
    }

    attachListener = () => {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.handleAjaxResponse(ajaxOptions, jqXHR?.responseJSON));
        $('#submit-btn').click(this.submitForm);
    }

    executeInitialActions = () => {
        this.checkPaidType();
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.captchaResolver = resolveCaptcha('dntCaptchaImg');
        this.captchaResolver.then(value => setResolvedCaptcha(value, 'in-captcha')).catch(alertError);
        Promise.all([this.captchaResolver, this.formReady.operator]).then(() => onResolved($('#in-captcha').val()));
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
        if ($('#form1').valid()) this.record ? preview_data() : $("#form1").submit();
        else alertError('Check the required fields!');
    }

    onComplete = () => {
        showAlert(MessageType.Success, "Gatepass Created Successfully.", 3);
        // PrintLastReciepts(false, extraRecipient).catch(AlertError).finally(() => {
        //     ExpressConfig.RemoveConfiguration();
        //     window.location.href = '/Traders/Dashboard';
        // })

        //     const record = await FetchLastRecord('/Traders/GetDigitalPaymentList');
        //     cost: `${record.totalAmount}`,
        //     description: `7R/${record.sbirefno}`,

        // setTimeout(() => {
        //     $('.swal-overlay').hide();
        //     $('#customModal').hide();
        //     showLoader('Finalizing Record...');

        //     if (this.Record) {
        //         fetch(Url.PopRecord)
        //             .then(HandleResponse)
        //             .catch(err => { if (err.code !== 204) AlertError(err) })
        //             .finally(() => this.OnComplete(this.Record.Recipient));
        //     }
        //     else this.OnComplete();
        // }, 100);
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