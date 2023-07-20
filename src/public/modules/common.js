import { Add_Gatepass } from "./add_gatepass.js";
import { Add_Six_R } from "./add_six_r.js";
import { HttpMessages, MessageType } from "./constants.js";
import { Digital_Payment, Success, Generated_Digital_Payment } from "./payment.js";
import { List_Entries } from "./listentries.js";
import { Login } from "./login.js";
import { NineR } from "./niner.js";
import { NineRSubmit } from "./ninersubmit.js";
import { PrintNinerR } from "./print9r.js";
import { PrintGatePass } from "./printgatepass.js";
import { FetchLastRecordId, ShowAlert } from "./utils.js";

const CommonDiv = '#content > div > div';
const PrintDiv = '#content';
const LoginDiv = '.box-login';

export const RouteMap = {
    add_six_r: { Script: Add_Six_R, Div: CommonDiv },
    NineR: { Script: NineR, Div: CommonDiv },
    NineRSubmit: { Script: NineRSubmit, Div: CommonDiv },
    add_gatepass: { Script: Add_Gatepass, Div: CommonDiv },
    print_9R: { Script: PrintNinerR, Div: PrintDiv },
    print_gatepass: { Script: PrintGatePass, Div: PrintDiv },
    DigitalPayment: { Script: Digital_Payment, Div: CommonDiv },
    GeneratedDigitalPayment: { Script: Generated_Digital_Payment, Div: CommonDiv },
    generated_9R: { Script: List_Entries, Div: CommonDiv },
    DigitalPaymentList: { Script: List_Entries, Div: CommonDiv },
    generated_gatepass: { Script: List_Entries, Div: CommonDiv },
    index: { Script: Login, Div: LoginDiv },
    Account: { Script: Login, Div: LoginDiv },
    Success: { Script: Success, Div: CommonDiv }
}

export const AlertError = (err) => err.message ? ShowAlert(MessageType.Error, err.message) : ShowAlert(MessageType.Error, err);
export const LogError = (err) => console.log(err.message);
export const HandleResponse = (response) => {
    if (!response.ok || response.status === 204)
        throw { message: HttpMessages[response.status], code: response.status }
}
export const HandleJsonResponse = (response) => {
    HandleResponse(response);
    return response.json();
}

export const HandleByStatusCode = (response) => {
    HandleResponse(response);
    return response;
}

export const Download = async (response) => {
    const fileName = response.url.split('/').pop();
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export const SetPrintConfig = (target, ninerId, gatepassId) => localStorage.setItem('ExpressPrint', JSON.stringify({ IsExpress: true, Target: target, GP: gatepassId, NinerR: ninerId }));

export const RemovePrintConfig = async () => localStorage.removeItem('ExpressPrint');

export const GetPrintConfig = () => {
    const config = JSON.parse(localStorage.getItem('ExpressPrint'));
    return config?.IsExpress ? config : { IsExpress: false };
}

export const PrintLastRecords = async (target) => {
    const ninerId = await FetchLastRecordId('/Traders/SP_Get_9R_List');
    const gatepassId = await FetchLastRecordId('/Traders/SP_Get_Gatepass_List');
    SetPrintConfig(target, ninerId, gatepassId);

    window.open(`/Receipt/print_9rs/${ninerId}`, '_blank');
}