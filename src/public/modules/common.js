import { Add_Gatepass } from "./add_gatepass.js";
import { Add_Six_R } from "./add_six_r.js";
import { HttpMessages } from "./constants.js";
import { Digital_Payment, Success, Generated_Digital_Payment } from "./payment.js";
import { List_Entries } from "./listentries.js";
import { Login } from "./login.js";
import { NineR } from "./niner.js";
import { NineRSubmit } from "./ninersubmit.js";
import { PrintNinerR } from "./print9r.js";
import { PrintGatePass } from "./printgatepass.js";

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
    generated_gatepass: { Script: List_Entries, Div: CommonDiv },
    index: { Script: Login, Div: LoginDiv },
    Account: { Script: Login, Div: LoginDiv },
    Success: {Script: Success, Div: CommonDiv}
}

export const AlertError = (err) => err.message ? alert(err.message) : alert(err);
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

export const Download = (response) => {
    const fileName = response.url.split('/').pop();
    response.blob().then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    });
}
