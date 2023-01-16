// ==UserScript==
// @name         EMandi Helper
// @version      1.0
// @description  Helper Script to Autofill EMandi
// @author       Kishan
// @match        https://emandi.up.gov.in/*
// @grant        none

// ==/UserScript==

window.addEventListener('load', (event) => {
    console.log("Injecting Emandi Script...");
    var script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.innerHTML = "import { RunScript } from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@b6760f0/static/Emandi.js'; RunScript();";
    document.getElementsByTagName('body')[0].appendChild(script);
});
