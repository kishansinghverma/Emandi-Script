import { MessageType, Url } from "../constants.js";
import { AlertError, HandleResponse, ShowAlert } from "./utils.js";

export const FetchLastRecord = async (url) => {
    $('#loader').show();
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: `draw=1&order[0][column]=1&order[0][dir]=desc&start=0&length=1`
    });

    const data = await response.json();
    $('#loader').hide();
    return data.data[0];
}

export const FetchLastRecordId = async (url) => {
    const data = await FetchLastRecord(url);
    return data.id;
}