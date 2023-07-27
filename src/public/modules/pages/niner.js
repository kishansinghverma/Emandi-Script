import { MessageType } from "../constants.js";
import { Form } from "../services/form.js";
import { Capitalize, ShowAlert } from "../services/utils.js";

class Niner extends Form {
    async InitializeForm() {
        this.ShowRecord();
        await this.ExecuteInitialActions();
    }

    async ExecuteInitialActions() {
        await this.ExpressConfiguration.ExecuteViaExpress(() => this.RunHeadless());
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
        ShowAlert(MessageType.Info, 'Running In Express Mode...');
        this.SelectEntry();
        this.UpdateForm();
        submitDetailsForm();
    }
}

export const NineR = new Niner();