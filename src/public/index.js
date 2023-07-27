import { Modals } from "./assets/modals.js";
import { RouteMap } from "./modules/constants.js";
import { RunInitialServices } from "./modules/services/initialization.js";

(async () => {
    console.log("Injecting Emandi Script...");

    await RunInitialServices();

    const route = window.location.href.split('/').pop().split('?')[0];
    if (!Object.keys(RouteMap).includes(route)) throw new Error('Injection not valid for this page!');

    document.querySelector(RouteMap[route].Div).appendChild($('<div>').addClass('custom-modal-container').html(Modals[route])[0]);
    window.formContext = RouteMap[route].Script;
    window.formContext.InitializeForm();
})();



