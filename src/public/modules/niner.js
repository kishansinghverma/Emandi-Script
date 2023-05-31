import { Form } from "./form.js";

class Niner extends Form {
    async InitializeForm() {
        await this.FetchRecord();
        this.record = window.formContext.record;
        this.ExecuteInitialActions();
    }

    ExecuteInitialActions() {
        const expressConfig = JSON.parse(localStorage.getItem('ExpressConfig'));
        if (this.record && expressConfig?.IsExpress) {
            if (expressConfig?.Id === this.record.Id) this.RunHeadless();
            else alert('Unable To Start In Express Mode!');
        }
    }

    SelectEntry() {
        $('#bname').val(this.record.Party);
    };

    UpdateForm() {
        if (this.record.PartyLicence) {
            $('#uttar_pradesh').prop('checked', true).trigger('change');
            $('#br').prop('checked', true).trigger('change');
        }
        else {
            $('#buyer_state').prop('checked', true).trigger('change');
            $('#ForSelf').prop('checked', true).trigger('change');
            $('#kreta_details').val(this.Capitalize($('#bname').val()));
        }
        $('#crop_code').val('58').trigger('change');
        $('#StockTypeCategory').val('1').trigger('change');
        $('input[name="PayType"][value="1"]').prop('checked', true).trigger('change');
        $('#nextBtn').removeAttr('disabled');
    }

    Next() {
        this.RemoveExpressConfig();
        submitDetailsForm();
    }

    RunHeadless() {
        this.SelectEntry();
        this.UpdateForm();
        this.Next();
    }
}

export const NineR = new Niner();