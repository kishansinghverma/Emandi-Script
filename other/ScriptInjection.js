// ==UserScript==
// @name         EMandi Helper
// @version      1.0
// @description  Helper Script to Autofill EMandi
// @author       Kishan
// @match        https://emandi.up.gov.in/*
// @match        http://emandi.up.gov.in/*
// @match        https://merchant.onlinesbi.sbi/*
// @grant        none
// @run-at       document-start

// ==/UserScript==

window.addEventListener('load', () => {
    // To Inject On Payment Gateway
    const page = window.location.href;
    if (page.includes('merchantprelogin')) paySubmitUPI('UPI');
    if (page.includes('merchantotherupidisplay')) { $('#vpa').click(); $('#vpa1').val('7037433280@ybl'); submitDataUpi(); }
    if (page.includes('merchantinterother')) $('#Go').click();
    if (page.includes('merchantupiconfirm')) redirectToHandler();

    window.isPrepaid = false;

    // To Inject On Emandi
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    //script.src = "http://localhost:3001/public/index.js";
    script.src = "https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/index.js";
    document.body.appendChild(script);
});
