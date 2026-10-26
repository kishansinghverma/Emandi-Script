import { formatDate, formatIsoString } from "../modules/services/utils.js";

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

export const StartTaggingButton = `
    <li>
        <a href="#">
            <i class="fa fa-refresh"></i>
            <span> Start Tagging </span>
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

export const recordComponent = (record) => {
    const component = $(`
        <div class="info-heading">
            <div class="info-name wrap-text"></div>
            <div class="info-date wrap-text"></div>
        </div>
        <div class="input-group">
            <div class="info-vehicle f-icon"></div>
            <div class="info-weight f-icon"></div>
        </div>
        <div class="info-party f-icon"></div>
    `);

    const date = formatIsoString(record.date);
    component.find('.info-name').text(record.seller);
    component.find('.info-date').toggleClass('valid', formatDate(new Date()) === date).text(date);
    component.find('.info-vehicle').text(record.vehicleNumber);
    component.find('.info-weight').text(`${record.weight} Qtl.`);
    component.filter('.info-party').text(`${record.party.name}, ${record.party.mandi}, ${record.party.state}`);
    return component;
};

export const vehicleTaggingModal = `
<div class="vehicle-tagging-modal" role="dialog" aria-modal="true" aria-label="Vehicle Tagging">
    <div class="custom-modal-header">
        <div><i class="fa fa-tag" style="margin-right: 0.5rem;"></i><span class="vehicle-tagging-title">Vehicle Tagging</span></div>
        <div class="link" role="button" aria-label="Close">&#x2715;</div>
    </div>
    <div class="vehicle-tagging-modal-content"></div>
    <div class="vehicle-tagging-controls">
        <label class="vehicle-tagging-control">
            <i class="fa fa-search"></i>
            <button type="button" class="vehicle-tagging-step vehicle-tagging-zoom-decrease" aria-label="Decrease zoom">−</button>
            <input type="range" class="vehicle-tagging-zoom" min="0" max="100" step="0.1" value="0" aria-label="Zoom" />
            <button type="button" class="vehicle-tagging-step vehicle-tagging-zoom-increase" aria-label="Increase zoom">+</button>
            <output class="vehicle-tagging-zoom-value">100%</output>
        </label>
        <label class="vehicle-tagging-control">
            <i class="fa fa-rotate-right"></i>
            <button type="button" class="vehicle-tagging-step vehicle-tagging-rotation-decrease" aria-label="Decrease rotation">−</button>
            <input type="range" class="vehicle-tagging-rotation" min="-180" max="180" step="1" value="0" aria-label="Rotation" />
            <button type="button" class="vehicle-tagging-step vehicle-tagging-rotation-increase" aria-label="Increase rotation">+</button>
            <output class="vehicle-tagging-rotation-value">0°</output>
        </label>
    </div>
    <div class="vehicle-tagging-modal-footer">
        <button type="button" class="vehicle-tagging-button vehicle-tagging-reload" aria-label="Reset image adjustments">
            <i class="fa fa-refresh"></i>Reset
        </button>
        <div class="vehicle-tagging-next-actions">
            <button type="button" class="vehicle-tagging-button vehicle-tagging-back" aria-label="Back">
                <i class="fa fa-arrow-left"></i>Back
            </button>
            <button type="button" class="vehicle-tagging-button vehicle-tagging-next" aria-label="Continue">
                <span class="vehicle-tagging-next-label">Next</span><i class="fa fa-arrow-right"></i>
            </button>
        </div>
    </div>
</div>`;

export const vehicleTaggingEditor = `
<div class="vehicle-tagging-image-container">
    <canvas class="vehicle-tagging-canvas" role="img" aria-label="Vehicle image"></canvas>
    <div class="vehicle-tagging-crop-frame" aria-hidden="true">
        <span class="vehicle-tagging-grid vertical-one"></span>
        <span class="vehicle-tagging-grid vertical-two"></span>
        <span class="vehicle-tagging-grid horizontal-one"></span>
        <span class="vehicle-tagging-grid horizontal-two"></span>
    </div>
</div>`;

export const vehicleTaggingLocation = `
<div class="vehicle-tagging-location-container">
    <div class="vehicle-tagging-map-wrapper">
        <iframe class="vehicle-tagging-map" title="Selected location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <div class="vehicle-tagging-location-fields">
        <label>Latitude<input class="vehicle-tagging-latitude" type="number" step="any"></label>
        <label>Longitude<input class="vehicle-tagging-longitude" type="number" step="any"></label>
    </div>
    <button type="button" class="vehicle-tagging-button vehicle-tagging-randomize">
        <i class="fa fa-random"></i>Randomize
    </button>
</div>`;

export const vehicleTaggingReview = (vehicleUrl, plateUrl) => `
<div class="vehicle-tagging-review-container">
    <div class="vehicle-tagging-review">
        <div class="vehicle-tagging-review-item vehicle-review-item">
            <span>Vehicle Image</span>
            <img src="${vehicleUrl}" alt="Finalized Vehicle Image" />
        </div>
        <div class="vehicle-tagging-plate-review-column">
            <div class="vehicle-tagging-review-item plate-review-item">
                <span>Number Plate Image</span>
                <img src="${plateUrl}" alt="Finalized Number Plate Image" />
            </div>
            <div class="vehicle-tagging-review-info-cards">
                <div class="vehicle-tagging-review-info-card vehicle-tagging-vehicle-details-card">
                    <span>Vehicle Details</span>
                    <strong class="vehicle-tagging-review-vehicle-details-value">—</strong>
                </div>
                <div class="vehicle-tagging-review-info-card vehicle-tagging-gatepass-card">
                    <span>Gatepass Number</span>
                    <strong class="vehicle-tagging-review-gatepass-value">—</strong>
                </div>
                <div class="vehicle-tagging-review-info-card">
                    <span>GPS Coordinates</span>
                    <strong class="vehicle-tagging-review-gps-value">—</strong>
                </div>
            </div>
        </div>
    </div>
</div>`;
