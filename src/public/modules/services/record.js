import { MessageType, Url } from "../constants.js";
import { alertError, handleJsonResponse, hideLoader, showAlert, showLoader } from "./utils.js";


class RecordService {
    #storagePath = 'Record';

    setRecord = (payload) => localStorage.setItem(this.#storagePath, JSON.stringify(payload));

    removeRecord = () => localStorage.removeItem(this.#storagePath);

    #handlePayload = (record) => {
        if (record) return record;
        showAlert(MessageType.Info, 'No Gatepass Queued', 5);
    }

    #fetchRecord = async () => {
        showLoader('Checking Queue...')
        return fetch(Url.PeekRecord).then(handleJsonResponse).then(this.#handlePayload).catch(alertError).finally(hideLoader);
    }

    getRecord = async () => {
        const localData = localStorage.getItem(this.#storagePath);
        return (!localData || !Object.keys(localData)) ?
            (await this.#fetchRecord()) : JSON.parse(localStorage.getItem(this.#storagePath));
    }
}

export const recordService = new RecordService();