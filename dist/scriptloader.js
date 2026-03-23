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

window.addEventListener('load', async () => {
    // To Inject On Payment Gateway
    const page = window.location.href;
    if (page.includes('merchantprelogin')) paySubmitUPI('UPI');
    if (page.includes('merchantotherupidisplay')) $('#Go').click();
    if (page.includes('merchantupiconfirm')) redirectToHandler();
    if (page.includes('merchantinterother')) {
        $(document).ajaxSuccess((event, jqXHR, option) => {
            if (option.url.includes('generateqrindenturl')) {
                const phonePeUrl = $("#qrindentdiv > a").attr("href").replace("upi://", "phonepe://");
                $("#qrindentdiv > a").attr("href", phonePeUrl);
            }
        });
    }

    window.isPrepaid = false;

    // To Inject On Emandi
    const url = 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist';
    // const url = 'http://localhost:3001/public';

    $('<link>').attr('rel', 'stylesheet').attr('href', `${url}/assets/style.css`)
        .on('load', async () => { await import(`${url}/index.js`) })
        .appendTo(document.head);
});
