export const SendRecieptButton = `
    <li>
        <a href="#" onclick="{ window.commonContext.PrintLastRecords(false); }">
            <i class="fa fa-envelope-o"></i>
            <span> Send Last Reciepts </span>
        </a>
    </li>`;

export const PrintRecieptButton = `
    <li>
        <a href="#" onclick="{ if(confirm('Are You Sure To Print?')) window.commonContext.PrintLastRecords(true); }">
            <i class="fa fa-print"></i>
            <span> Print Last Reciepts </span>
        </a>
    </li>`;

export const notificationComponent = `
    <div class="notification-container">
        <div class="notification-body">
            <div class="icon"></div>
            <div class="message"></div>&emsp;
            <div class="link">&#x2715;</div>
        </div>
    </div >`;

export const recordComponent = (record) => (`
    <div class="info-heading wrap-text">${record.seller}</div>
    <div class="info-sub-heading">${record.date}</div>
    <div class="info-text wrap-text">${record.party.name}, ${record.party.mandi}</div>
`);
