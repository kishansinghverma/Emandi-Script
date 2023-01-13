import { Modals } from "./modules/modals.js";
import { CSS } from "./modules/style.js";
import { RouteMap } from "./modules/scripts/common.js";
import { RunBasicCustomizations } from "./modules/scripts/basiccustomization.js";

export const RunScript = () => {
    const validRoutes = Object.keys(RouteMap);
    const route = window.location.href.split('/').pop();

    alert(route);

    if(window.location.href.includes('emandi.up.gov.in/Traders/'))
        RunBasicCustomizations();

    if (!validRoutes.includes(route))
        throw new Error('Injection not valid for this page');

    var css = document.createElement("style");
    css.innerHTML = CSS;
    document.getElementsByTagName('head')[0].append(css);

    const modalDiv = document.createElement('div');
    modalDiv.className = "custom-modal-container";
    modalDiv.innerHTML = Modals[route];
    document.querySelector(RouteMap[route].Div).append(modalDiv);

    window.formContext = RouteMap[route].Script;
    window.formContext.InitializeForm();
}




