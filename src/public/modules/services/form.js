import { recordService } from "./record.js";

export class Form {
    initForm = async () => {
        this.record = await recordService.getRecord();
        this.renderRecord(this.record);
    }

    renderRecord = (record) => {
        if (record) {
            this.selectRecord(record);
            $('.record').fadeIn()
                .append(`<div class="info-heading wrap-text">${record.seller}</div>`)
                .append(`<div class="info-sub-heading">${record.date}</div>`)
                .append(`<div class="info-text wrap-text">${record.party.name}, ${record.party.mandi}</div>`);
        }
    }

    getNestedValue = (path, record) => {
        return path.split('.').reduce((o, k) => o && o[k], record);
    }

    selectRecord = (record) => {
        const inputs = $('#custom-modal-content input[data-property]');
        inputs.each((_, input) => $(input).val(this.getNestedValue($(input).data('property'), record)));
    }

    allowUpdate = (str) => {
        str.length === 4 ? $('#submit-btn').removeAttr('disabled') : $('#submit-btn').attr('disabled', true);
    }
}