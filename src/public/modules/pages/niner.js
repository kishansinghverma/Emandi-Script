import { RecordHandler } from "../services/record.js";
import { capitalize } from "../services/utils.js";
import { DefaultValues } from "../constants.js";

class Niner extends RecordHandler {
    async initializeForm() {
        await this.executeInitialActions();
        this.attachListener();
    }

    attachListener = () => {
        $('#bname').on('input', ({ target }) => target.value ? $('#next-btn').removeAttr('disabled') : $('#next-btn').attr('disabled', true));
        $('#next-btn').click(this.submitForm);
    }

    executeInitialActions = async () => {
        this.renderRecord().then(() => $('#is-licenced').prop('checked', Boolean(this.record?.party?.licenceNumber)));
    }

    updateForm() {
        if ($('#is-licenced').prop('checked')) {
            $('#uttar_pradesh').prop('checked', true).trigger('change');
            $('#br').prop('checked', true).trigger('change');
        }
        else {
            $('#buyer_state').prop('checked', true).trigger('change');
            $('#ForSelf').prop('checked', true).trigger('change');
            $('#kreta_details').val(capitalize($('#bname').val()));
        }
        $('#crop_code').val(DefaultValues.CropCode).trigger('change');
        $('#StockTypeCategory').val(DefaultValues.StockTypeCategory).trigger('change');
        $('input[name="PayType"][value="1"]').prop('checked', true).trigger('change');
    }

    submitForm = () => {
        this.updateForm();
        submitDetailsForm();
    }
}

export const NineR = new Niner();