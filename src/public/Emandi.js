import { Modals } from "./assets/modals.js";
import { RouteMap } from "./modules/common.js";
import { RunBasicCustomizations } from "./modules/basiccustomization.js";

const RunScript = () => {
    console.log("Injecting Emandi Script...");

    const route = window.location.href.split('/').pop().split('?')[0];
    RunBasicCustomizations();

    if (!Object.keys(RouteMap).includes(route))
        throw new Error('Injection not valid for this page');

    document.querySelector(RouteMap[route].Div).appendChild($('<div>').addClass('custom-modal-container').html(Modals[route])[0]);
    window.formContext = RouteMap[route].Script;
    window.formContext.InitializeForm();
}

RunScript();



