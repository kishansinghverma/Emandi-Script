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
    switch (window.location.href.split('/').pop()) {
        case 'merchantprelogin.htm':
            paySubmitUPI('UPI'); break;
        case 'merchantotherupidisplay.htm':
            $('#vpa').click(); $('#vpa1').val('7037433280@ybl'); submitDataUpi(); break;
        case 'merchantinterother.htm':
            $('#Go').click(); break;
        case 'merchantupiconfirm.htm':
            redirectToHandler(); break;
    }

    // To Inject On Emandi
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    //script.src = "http://localhost:3001/public/Emandi.js";
    script.src = "https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/emandi.js";
    document.body.appendChild(script);
});