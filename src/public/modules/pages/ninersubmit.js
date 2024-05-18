import { MessageType, StageMap, Stages } from "../constants.js";
import { onResolved, resolveCaptcha, setResolvedCaptcha, validateCaptcha } from "../services/captcha.js";
import { RecordHandler } from "../services/record.js";
import { alertError, showAlert } from "../services/utils.js";

class NinerSubmit extends RecordHandler {
    initializeForm = () => {
        this.validateExecution();
        this.attachListener();
        this.executeInitialActions();
    }

    attachListener = () => {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.postAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
        $('#in-captcha').on('input', ({ target }) => onResolved(target.value));
        $('#submit-btn').click(this.submitForm);
    }

    executeInitialActions = () => {
        $('#img-captcha').append($('#dntCaptchaImg'));
        this.captchaResolver = resolveCaptcha('dntCaptchaImg');
        this.captchaResolver.then(value => setResolvedCaptcha(value, 'in-captcha')).catch(alertError);
        this.renderRecord();
    }

    validateExecution = () => {
        if (!$('#dntCaptchaImg')[0]) {
            showAlert(MessageType.Error, "No Paid 6R found!", 5);
            $('.custom-modal').hide();
            throw new Error('No Paid 6R found!');
        }
    }

    updateForm = () => {
        $('#crop_type').val('Regular');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        this.selectEntries();
        $('#rate').val($('#cropminrate').val()).trigger('change');
    }

    selectEntries() {
        let requiredWeight = parseFloat($('#weight').val());
        if (isNaN(requiredWeight) || !(requiredWeight > 0)) {
            alertError('Weight Not Provided!');
            throw new Error('Weight Not Provided!');
        }

        $('#tblData1 > tbody:nth-child(2) > tr').not(':last').each((index, row) => {
            const weight = parseFloat($(row).find('.Currentweights').val());
            $(row).find('.chk').click();
            if (requiredWeight <= weight) {
                $(row).find('.weights').val(requiredWeight).trigger('change');
                return false;
            }
            else {
                $(row).find('.weights').val(weight).trigger('change');
                requiredWeight -= weight;
            }
        });

        if (parseFloat($('#weight').val()) === parseFloat($('#takenQty').text()))
            showAlert(MessageType.Success, `Quantity Selected : ${$('#takenQty').text()} Quintal.`)
        else {
            alertError('Quantity Unavailable!<br>Select Manually...');
            throw new Error('Select Manually...');
        }
    }

    submitForm = () => {
        this.updateForm();
        this.record ? this.executeRequest() : preview_data();
    }

    executeRequest = () => {
        $('#loader').show();
        $.ajax({
            url: $("#form1").attr("action"),
            method: "post",
            data: $('#form1').serialize(),
            async: false
        });
        $('#loader').hide();
    }

    onComplete = () => {
        showAlert(MessageType.Success, "Niner Created Successfully.", 5);
        if (this.record) this.setRecord({
            ...this.record,
            rate: $('#rate').val()
        });
        window.location.href = StageMap[Stages.Gatepass].Url;
    }

    postAjaxCall(url, response) {
        if (Array.isArray(response) && response.length > 0) {
            if (url.includes('/Traders/NineRSubmit')) {
                // Validate Captcha is correctly parsed.
                validateCaptcha(response);
                //Handles form sumission.
                if (response[0].status > 0) this.onComplete();
                else alertError(response[0].msg);
            }
        }
    }
}

export const NineRSubmit = new NinerSubmit();