import { MessageType, StageMap, Stages } from "../constants.js";
import { onResolved, resolveCaptcha, setResolvedCaptcha, validateCaptcha } from "../services/captcha.js";
import { RecordHandler } from "../services/record.js";
import { ComplexPromise, alertError, capitalize, hideModal, showAlert } from "../services/utils.js";
class AddSixR extends RecordHandler {
    initializeForm = async () => {
        this.licenceFetcher = new ComplexPromise();
        this.rateFetcher = new ComplexPromise();
        this.cropTypeFetcher = new ComplexPromise();
        this.attachListener();
        this.executeInitialActions();
    }

    attachListener = () => {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.postAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
        $('#in-captcha').on('input', ({ target }) => onResolved(target.value));
        $('#refresh-btn').click(this.refreshForm);
        $('#submit-btn').click(this.submitForm);
    }

    executeInitialActions = async () => {
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.captchaResolver = resolveCaptcha('dntCaptchaImg');
        this.captchaResolver.then(value => setResolvedCaptcha(value, 'in-captcha')).catch(alertError);
        this.renderRecord();
    }

    refreshForm = () => {
        $('.record').fadeOut(400, () => {
            hideModal();
            this.removeRecord();
            location.reload();
        });
    }

    updateForm = () => {
        $('#vikreta_details').val(capitalize($('#sname').val()));
        $('#vikreta_mobile').val('7037433280');
        if ($('#licence').val()) {
            $('#trader_type').prop('checked', true).trigger('change');
            $('#kreta_license_number').val($('#licence').val()).trigger('change');
        }
        else $('#ForSelf').prop('checked', true).trigger('change');
        $('#crop_code').val('58').trigger('change');
        $('#crop_weight').val(parseFloat($('#quantity').val()).toFixed(3));
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    submitForm = () => {
        this.updateForm();
        Promise.allSettled([this.rateFetcher.operator, this.licenceFetcher.operator, this.cropTypeFetcher.operator]).then(() => {
            if ($('#form1').valid()) this.record ? $("#form1").submit() : preview_data();
            else alertError('Check the required fields!');
        });
    }

    onComplete = () => {
        if (this.record) this.setRecord(this.record);
        showAlert(MessageType.Success, '6R Created Successfully.<br>Heading To Payment');
        window.location.href = StageMap[Stages.Payment].Url;
    }

    postAjaxCall = (url, response) => {
        console.log(response);
        if (Array.isArray(response) && response.length > 0) {
            // Resolves the Promise waiting for fetching Rate.
            if (url.includes('/Traders/get_crop_fees')) {
                $('#crop_rate').val(response[0].min_rate).trigger('change');
                this.rateFetcher.resolve();
            }
            // Resolves the Promise waiting for Kreta Details. 
            else if (url.includes('/Traders/get_license_detail')) {
                this.licenceFetcher.resolve();
            }
            // Resolves the Promise waiting for Crop Type
            else if (url.includes('/Traders/BindCropTypeDropDown')) {
                $('#crop_type_code').val(response[0].VarietyCode).trigger('change');
                this.cropTypeFetcher.resolve();
            }
            else if (url.includes('Traders/add_six_r')) {
                // Validate Captcha is correctly parsed.
                validateCaptcha(response);
                // Handles Form Submission
                if (response[0].status > 0) this.onComplete();
            }
        }
    }
}

export const Add_Six_R = new AddSixR();