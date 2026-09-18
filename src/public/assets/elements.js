import { getDate } from "../modules/services/utils.js";

export const SendReceiptButton = `
    <li>
        <a href="#">
            <i class="fa fa-envelope-o"></i>
            <span> Send Last Receipts </span>
        </a>
    </li>`;

export const PrintReceiptButton = `
    <li>
        <a href="#">
            <i class="fa fa-print"></i>
            <span> Print Last Receipts </span>
        </a>
    </li>`;

export const notificationComponent = `
    <div class="notification-container" role="status" aria-live="polite" aria-atomic="true">
        <div class="notification-body">
            <div class="icon" aria-hidden="true"></div>
            <div class="message"></div>
            <button type="button" class="link" aria-label="Close notification">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M4 4l8 8M12 4l-8 8"></path>
                </svg>
            </button>
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
