import { Form } from "./common.js";

class Niner extends Form {
    InitializeForm() {
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    SelectEntry() {
        document.getElementById('bname').value = this.record.Party;
    };

    UpdateForm() {
        document.getElementById('buyer_state').checked = true;
        document.getElementById('buyer_state').dispatchEvent(new Event('change'));
        document.getElementById('ForSelf').checked = true;
        document.getElementById('ForSelf').dispatchEvent(new Event('change'));
        document.getElementById('crop_code').value = '58';
        document.getElementById('crop_code').dispatchEvent(new Event('change'));
        document.getElementById('kreta_details').value = this.Capitalize(document.getElementById('bname').value);
        document.getElementById('StockTypeCategory').value = '1';
        document.getElementById('StockTypeCategory').dispatchEvent(new Event('change'));
        document.getElementsByName('PayType')[1].checked = true;
        document.getElementsByName('PayType')[1].dispatchEvent(new Event('change'));
        document.getElementById('nextBtn').removeAttribute('disabled');
    }

    Next() {
        submitDetailsForm();
    }
}

export const NineR = new Niner();