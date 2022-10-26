import { Modals } from "./modules/modals.js";
import { CSS } from "./modules/style.js";
import { Add_Six_R } from "./modules/scripts/add_six_r.js";
import { NineR } from "./modules/scripts/niner.js";

const sixr = 'add_six_r';
const niner = 'NineR';
const ninerSubmit = 'NineRSubmit';
const gatepass = 'add_gatepass';
const print9R = 'print_9R';
const printGatepass = 'print_gatepass';
const selectPayment = 'DigitalPayment';
const doPayment = 'GeneratedDigitalPayment';

const validRoutes = [sixr, niner, ninerSubmit, gatepass, print9R, printGatepass, selectPayment, doPayment];
const route = window.location.href.split('/').pop();

const scripts = {
    [sixr]: Add_Six_R,
    [niner]: NineR
};

export const RunScript = () => {
    if (!validRoutes.includes(route))
        throw new Error('Injection not valid for this page');

    var css = document.createElement("style");
    css.innerHTML = CSS;
    document.getElementsByTagName('head')[0].append(css);

    const modalDiv = document.createElement('div');
    modalDiv.className = "modal-container";
    modalDiv.innerHTML = Modals[route];
    document.querySelector('#content > div > div').append(modalDiv);

    window.formContext = scripts[route];
    window.formContext.InitializeForm();
}




