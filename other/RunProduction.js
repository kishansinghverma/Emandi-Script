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
    script.src = "https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/emandi.js";
    document.getElementsByTagName('body')[0].appendChild(script);
});
