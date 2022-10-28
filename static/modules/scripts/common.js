import { Add_Gatepass } from "./add_gatepass.js";
import { Add_Six_R } from "./add_six_r.js";
import { Digital_Payment } from "./digitalpayment.js";
import { List_Entries } from "./listentries.js";
import { Generated_Digital_Payment } from "./makepayment.js";
import { NineR } from "./niner.js";
import { NineRSubmit } from "./ninersubmit.js";
import { PrintNinerR } from "./print9r.js";
import { PrintGatePass } from "./printgatepass.js";

const CommonDiv = '#content > div > div';
const PrintDiv = '#content';

export const RouteMap = {
    add_six_r: { Script: Add_Six_R, Div: CommonDiv },
    NineR: { Script: NineR, Div: CommonDiv },
    NineRSubmit: { Script: NineRSubmit, Div: CommonDiv },
    add_gatepass: { Script: Add_Gatepass, Div: CommonDiv },
    print_9R: { Script: PrintNinerR, Div: PrintDiv },
    print_gatepass: { Script: PrintGatePass, Div: PrintDiv },
    DigitalPayment: { Script: Digital_Payment, Div: CommonDiv },
    GeneratedDigitalPayment: { Script: Generated_Digital_Payment, Div: CommonDiv },
    generated_9R: {Script: List_Entries, Div: CommonDiv},
    generated_gatepass: {Script: List_Entries, Div: CommonDiv}
}