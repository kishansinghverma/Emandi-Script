import { recordComponent } from "../../assets/elements.js";
import { MessageType, Url } from "../constants.js";
import { alertError, getNestedValue, handleJsonResponse, hideLoader, showAlert, showLoader } from "./utils.js";

export class RecordHandler {
    #storagePath = 'Record';

    #handlePayload = (record) => {
        if (record) return record;
        showAlert(MessageType.Info, 'No Gatepass Queued', 5);
    }

    #fetchRecord = async () => {
        showLoader('Checking Queue...')
        return fetch(Url.PeekRecord).then(handleJsonResponse).then(this.#handlePayload).catch(alertError).finally(hideLoader);
    }

    #autoFillForm = (record) => {
        const inputs = $('.custom-modal-content input[data-property], .custom-modal-content select[data-property]');
        inputs.each((_, input) => {
            if ($(input).data('property')) {
                const tokens = $(input).data('property').split(',').map(item => getNestedValue(item, record));
                const value = tokens.slice(0, -1).join(', ') + (tokens.length > 1 ? ', ' : '') + tokens[tokens.length - 1];
                $(input).val(value).trigger('input');
            }
        });
    }

    setRecord = (payload) => localStorage.setItem(this.#storagePath, JSON.stringify(payload));

    removeRecord = () => localStorage.removeItem(this.#storagePath);
    
    getRecord = async () => {
        const localData = localStorage.getItem(this.#storagePath);
        return (!localData || !Object.keys(localData)) ?
            (await this.#fetchRecord()) : JSON.parse(localStorage.getItem(this.#storagePath));
    }

    renderRecord = async () => {
        this.record = await this.getRecord();
        if (this.record) $('.record').append(recordComponent(this.record)).fadeIn(400, () => this.#autoFillForm(this.record));
    }
}