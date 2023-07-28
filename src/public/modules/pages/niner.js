import { MessageType } from "../constants.js";
import { ExpressConfig } from "../services/express.js";
import { Form } from "../services/form.js";
import { Capitalize, ShowAlert } from "../services/utils.js";

class Niner extends Form {
    InitializeForm() {
        this.FetchRecord();
        this.ExecuteInitialActions();
    }

    ExecuteInitialActions() {
        ExpressConfig.ExecuteViaExpress(() => this.RunHeadless());
    }

    SelectEntry() {
        $('#bname').val(this.Record.Party);
    };

    UpdateForm() {
        if (this.Record?.PartyLicence) {
            $('#uttar_pradesh').prop('checked', true).trigger('change');
            $('#br').prop('checked', true).trigger('change');
        }
        else {
            $('#buyer_state').prop('checked', true).trigger('change');
            $('#ForSelf').prop('checked', true).trigger('change');
            $('#kreta_details').val(Capitalize($('#bname').val()));
        }
        $('#crop_code').val('58').trigger('change');
        $('#StockTypeCategory').val('1').trigger('change');
        $('input[name="PayType"][value="1"]').prop('checked', true).trigger('change');
        $('#nextBtn').removeAttr('disabled');
    }

    Next = () => submitDetailsForm();

    RunHeadless() {
        this.SetInProgress();
        this.SelectEntry();
        this.UpdateForm();
        submitDetailsForm();
    }
}

export const NineR = new Niner();