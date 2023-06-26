// ==UserScript==
// @name         EMandi Helper
// @version      1.0
// @description  Helper Script to Autofill EMandi
// @author       Kishan
// @match        https://emandi.up.gov.in/*
// @match        http://emandi.up.gov.in/*
// @grant        none
// @run-at       document-start

// ==/UserScript==

window.addEventListener('load', () => {
    console.log("Injecting Emandi Script...");
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    //script.src = "http://localhost:3001/public/Emandi.js";
    script.src = "https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/emandi.js";
    document.body.appendChild(script);
});