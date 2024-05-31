import { getDate } from "../modules/services/utils.js";

export const SendRecieptButton = `
    <li>
        <a href="#">
            <i class="fa fa-envelope-o"></i>
            <span> Send Last Reciepts </span>
        </a>
    </li>`;

export const PrintRecieptButton = `
    <li>
        <a href="#">
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
    <div class="info-heading">
        <div class="info-name wrap-text">${record.seller}</div>
        <div class="info-date wrap-text ${getDate() === record.date && 'valid'}">${record.date}</div>
    </div>
    <div class="input-group">
        <div class="info-vehicle f-icon">${record.vehicleNumber}</div>
        <div class="info-weight f-icon">${record.weight} Qtl.</div>
    </div>
    <div class="info-party f-icon">${record.party.name}, ${record.party.mandi}, ${record.party.state}</div>
`);
