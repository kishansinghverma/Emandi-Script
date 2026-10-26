import { FetchParams, HttpMessages, Labels, Messages, MessageType, Url } from "../constants.js";
import { sendRequest } from "./backend.js";
import { CaptchaLoader } from "../../assets/loader.js";
import { vehicleTaggingEditor, vehicleTaggingLocation, vehicleTaggingModal, vehicleTaggingReview } from "../../assets/elements.js";
import { RecordHandler } from "./record.js";
import { sendGatepassBySerialNumber, sendNinerBySerialNumber } from "./receipt.js";
import {
    alertError,
    blobToBase64,
    capitalize,
    gatepassDateFormatter,
    getImageLoadError,
    hideLoader,
    imageLabel,
    randomizeCoordinates,
    showAlert,
    showLoader,
    validCoordinates
} from "./utils.js";

const MODAL_SEL = '.vehicle-tagging-modal';
const VEHICLE_TAGGING_API = '/api/VehicleTaggingAPI';

const SIZES = {
    vehicle: { width: 771, height: 1024 },
    plate: { width: 341, height: 195 }
};
const LOCATION_SEED = { latitude: 27.4288667, longitude: 78.116275 };

const sendVehicleTaggingRequest = async (endpoint, payload) => fetch(`${VEHICLE_TAGGING_API}/${endpoint}`, {
    ... FetchParams.Post,
    credentials: 'omit',
    body: JSON.stringify(payload)
}).then(async res => {
    if (!res.ok) throw new Error(HttpMessages[res.status]);

    const data = await res.json();
    if (!data.resultStatus) throw new Error(data.resultMessage ?? HttpMessages[res.status]);

    return data.resultData;
});

export class VehicleTagging extends RecordHandler {
    currentStep = 'manual';
    selectedCoordinates = null;
    manualMode = false;
    imageError = null;
    directFinalize = false;
    locationPending = false;
    cleanInteractions = null;

    gatepass = {
        number: '',
        data: null,
        valid: false,
        pending: false,
        message: '',
        details: ''
    };

    media = {
        raw: {},
        previewUrls: {},
        finalized: {},
        reviewUrls: []
    };

    canvasState = {
        image: null,
        zoom: 1,
        minZoom: 1,
        rotation: 0,
        panX: 0,
        panY: 0
    };

    elements = {
        frame: null,
        canvas: null,
        cropFrame: null
    };

    cleanupMedia = () => {
        Object.values(this.media.previewUrls).forEach((url) => URL.revokeObjectURL(url));
        this.media.reviewUrls.forEach((url) => URL.revokeObjectURL(url));
        this.media.previewUrls = {};
        this.media.reviewUrls = [];
        this.media.raw = {};
        this.media.finalized = {};
    };

    resetState = () => {
        this.cleanInteractions?.();
        this.cleanInteractions = null;
        this.cleanupMedia();
        this.currentStep = 'manual';
        this.manualMode = true;
        this.imageError = null;
        this.directFinalize = false;
        this.locationPending = false;
        this.selectedCoordinates = null;
        this.gatepass = {
            number: '',
            data: null,
            valid: false,
            pending: false,
            message: '',
            details: ''
        };
        this.canvasState = {
            image: null,
            zoom: 1,
            minZoom: 1,
            rotation: 0,
            panX: 0,
            panY: 0
        };
        this.elements = { frame: null, canvas: null, cropFrame: null };
    };

    getInitialCoordinates = () => {
        const coords = this.record ? { latitude: this.record.latitude, longitude: this.record.longitude } : null;
        return validCoordinates(coords)
            ? { latitude: Number(coords.latitude).toFixed(7), longitude: Number(coords.longitude).toFixed(7) }
            : randomizeCoordinates(LOCATION_SEED);
    };

    manualImagesReady = () => Boolean(this.media.raw.vehicle && this.media.raw.plate);

    getImageReadyMessage = (successMessage = Messages.ImagesReadyNext) => this.gatepass.valid
        ? successMessage
        : Messages.ImagesReadyEnterGatepass;

    updateGatepassStatus = (message, valid = false, details = '') => {
        this.gatepass.message = message || '';
        this.gatepass.details = details;
        const status = $('.vehicle-tagging-gatepass-status')
            .empty()
            .toggleClass('is-valid', valid)
            .toggleClass('is-error', Boolean(message) && !valid);
        if (this.gatepass.details) {
            status.append(
                $('<span>').text(`${this.gatepass.message} `),
                $('<b>').text(this.gatepass.details),
                $('<span>').text('.')
            );
        } else {
            status.text(this.gatepass.message);
        }
    };

    validateGatepass = async () => {
        const value = String($('.vehicle-tagging-gatepass-input').val() || '').trim();
        this.gatepass.valid = false;
        this.gatepass.pending = true;
        this.gatepass.details = '';
        this.updateGatepassStatus('');
        $('.vehicle-tagging-gatepass-input-wrapper').addClass('loading');
        this.updateUI();

        if (!value) {
            this.gatepass.pending = false;
            $('.vehicle-tagging-gatepass-input-wrapper').removeClass('loading');
            this.updateGatepassStatus(Messages.GatepassNumberRequired);
            this.updateUI();
            return false;
        }

        try {
            const response = await sendVehicleTaggingRequest('GetVehicleNumberByGatepass', {
                GatepassNumber: value,
                InstrumentType: 1
            });

            this.gatepass.number = value;
            this.gatepass.data = response;
            this.gatepass.valid = true;

            this.updateGatepassStatus(
                Labels.GatepassValidatedFor,
                true,
                `${capitalize(response.vehicleName || 'Vehicle')} - ${response.vehicleNumber || 'Not Available'}`
            );

            if (this.manualImagesReady()) this.renderManualStep(this.getImageReadyMessage());
            return true;
        } catch (error) {
            this.updateGatepassStatus(error.message || Messages.UnableToValidateGatepass);

            if (this.manualImagesReady()) this.renderManualStep(this.getImageReadyMessage());
            return false;
        } finally {
            this.gatepass.pending = false;
            $('.vehicle-tagging-gatepass-input-wrapper').removeClass('loading');
            this.updateUI();
        }
    };

    preloadImage = async (type, path) => {
        if (!path) throw new Error(`No ${capitalize(type)} Image Is Available.`);
        const response = await fetch(`${Url.GetS3File}?path=${encodeURIComponent(path)}`);
        if (!response.ok) throw new Error(await getImageLoadError(type, response));

        const previousUrl = this.media.previewUrls[type];
        const url = URL.createObjectURL(await response.blob());
        const image = new Image();
        try {
            await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
                image.src = url;
            });
        } catch (_) {
            URL.revokeObjectURL(url);
            throw new Error(`Unable To Parse ${capitalize(imageLabel(type))} Image.`);
        }
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        this.media.previewUrls[type] = url;
        this.media.raw[type] = image;
    };

    loadRecordImages = async () => {
        this.cleanupMedia();
        this.imageError = null;
        this.renderManualStep(Messages.FetchingImages);
        showLoader(Messages.LoadingImages);

        const results = await Promise.all(['vehicle', 'plate'].map(async (type) => {
            const path = type === 'vehicle' ? this.record?.rawVehicleImage : this.record?.rawNumberPlateImage;
            if (!path) return;
            try {
                await this.preloadImage(type, path);
            } catch (error) {
                this.imageError = error.message;
            }
        }));
        void results;

        this.renderManualStep(this.imageError || (this.manualImagesReady()
            ? this.getImageReadyMessage()
            : Messages.ImagesNotAvailableManual));
        this.updateUI();
        hideLoader();
    };

    reloadStepZero = () => {
        this.gatepass = { number: '', data: null, valid: false, pending: false, message: '', details: '' };
        this.cleanupMedia();
        this.loadRecordImages().finally(() => this.validateGatepass());
    };

    resumeManualPipeline = () => {
        if (!this.manualImagesReady() || !this.gatepass.valid || this.gatepass.pending) return;
        this.imageError = null;
        this.manualMode = false;
        this.setStep('vehicle');
    };

    loadManualImage = (type, file) => {
        if (!file || !file.type.startsWith('image/')) {
            this.imageError = `Unable to parse ${imageLabel(type).toLowerCase()} image.`;
            this.renderManualStep(this.imageError);
            this.updateUI();
            return;
        }

        const previousUrl = this.media.previewUrls[type];
        const url = URL.createObjectURL(file);
        const image = new Image();
        this.renderManualStep(Messages.FetchingImages);
        this.updateUI();

        image.onload = () => {
            if (previousUrl) URL.revokeObjectURL(previousUrl);
            this.media.previewUrls[type] = url;
            this.media.raw[type] = image;
            this.imageError = null;
            this.renderManualStep(this.manualImagesReady()
                ? this.getImageReadyMessage()
                : 'Select Both Images To Continue.');
            this.updateUI();
        };
        image.onerror = () => {
            URL.revokeObjectURL(url);
            this.imageError = `Unable To Parse ${capitalize(imageLabel(type))} Image.`;
            this.renderManualStep(this.imageError);
            this.updateUI();
        };
        image.src = url;
    };

    bindManualPickers = () => {
        $('.vehicle-tagging-manual-picker-input').off('change.vehicleTagging').on('change.vehicleTagging', ({ target }) => {
            this.loadManualImage($(target).data('type'), target.files[0]);
            target.value = '';
        });
        $('.vehicle-tagging-manual-select').off('click.vehicleTagging keydown.vehicleTagging').on('click.vehicleTagging', function (event) {
            if (event.target.matches('.vehicle-tagging-manual-picker-input')) return;
            $(this).find('.vehicle-tagging-manual-picker-input').trigger('click');
        }).on('keydown.vehicleTagging', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                $(this).find('.vehicle-tagging-manual-picker-input').trigger('click');
            }
        });
    };

    bindGatepassInput = () => {
        $('.vehicle-tagging-gatepass-input')
            .off('blur.vehicleTagging')
            .on('blur.vehicleTagging', this.validateGatepass)
            .off('keydown.vehicleTagging')
            .on('keydown.vehicleTagging', (event) => {
                if (event.key !== 'Enter') return;
                event.preventDefault();
                this.validateGatepass();
            });
    };

    renderManualPicker = (type, index) => {
        const selected = Boolean(this.media.raw[type]);
        const picker = $('<div>', {
            class: `vehicle-tagging-manual-picker-card${selected ? ' has-image' : ''}`,
            'data-type': type
        }).append(
            $('<div>', { class: 'vehicle-tagging-manual-picker-title' }).append(
                $('<span>').text(index),
                $('<h3>').text(`${imageLabel(type)} Image`)
            )
        );

        const selectArea = $('<div>', {
            class: 'vehicle-tagging-manual-select',
            role: 'button',
            tabindex: 0,
            'aria-label': `Select ${imageLabel(type).toLowerCase()} image`
        }).append(
            $('<input>', {
                type: 'file',
                accept: 'image/*',
                class: 'vehicle-tagging-manual-picker-input',
                'data-type': type,
                hidden: true
            })
        );

        if (selected) {
            selectArea.append($('<img>', {
                src: this.media.previewUrls[type],
                alt: `${imageLabel(type)} image preview`
            }));
        } else {
            selectArea.append(
                $('<i>').addClass('fa fa-image vehicle-tagging-manual-select-icon'),
                $('<span>').text(Labels.ChooseAnImage)
            );
        }

        picker.append(selectArea);
        return picker;
    };

    renderManualStep = (message) => {
        this.cleanInteractions?.();
        this.cleanInteractions = null;
        this.elements = { frame: null, canvas: null, cropFrame: null };

        const isSuccessMessage = this.gatepass.valid
            && this.manualImagesReady()
            && (
                message === Messages.ImagesReadyNext
                || /Images Ready.*Click Next|Both Images Are Ready|Images Loaded From Record/i.test(message)
            );

        $('.vehicle-tagging-modal-content').html($('<div>', {
            class: 'vehicle-tagging-review-container vehicle-tagging-error-container'
        }).append(
            $('<div>', { class: 'vehicle-tagging-gatepass-field' }).append(
                $('<div>', { class: 'vehicle-tagging-gatepass-header' }).append(
                    $('<label>').text(Labels.GatepassNumber)
                ),
                $('<div>', { class: 'captcha-input-wrapper vehicle-tagging-gatepass-input-wrapper' }).append(
                    $('<input>', {
                        class: 'vehicle-tagging-gatepass-input',
                        type: 'text',
                        value: this.gatepass.number || $('#transaction_number').val() || '',
                        placeholder: Labels.GatepassNumber
                    }).attr('autocomplete', 'off'),
                    CaptchaLoader
                ),
                $('<span>', { class: 'vehicle-tagging-gatepass-status', role: 'status' })
            ),
            $('<div>', { class: 'vehicle-tagging-manual-pickers' }).append(
                this.renderManualPicker('vehicle', 1),
                this.renderManualPicker('plate', 2)
            ),
            $('<div>', { class: isSuccessMessage ? 'vehicle-tagging-image-error is-success' : 'vehicle-tagging-image-error', role: 'alert' }).append(
                $('<span>', { class: isSuccessMessage ? 'vehicle-tagging-image-status is-success' : 'vehicle-tagging-image-status' }).text(capitalize(message))
            ),
            this.record ? $('<div>', { class: 'vehicle-tagging-direct-finalize-card' }).append(
                $('<label>', { class: 'vehicle-tagging-direct-finalize' }).append(
                    $('<input>', {
                        type: 'checkbox',
                        class: 'vehicle-tagging-direct-finalize-checkbox'
                    }).prop('checked', this.directFinalize),
                    $('<span>').text(Labels.FinalizeDirectly)
                )
            ) : null
        ));

        this.bindManualPickers();
        this.bindGatepassInput();
        $('.vehicle-tagging-direct-finalize-checkbox')
            .off('change.vehicleTagging')
            .on('change.vehicleTagging', ({ target }) => {
                this.directFinalize = target.checked;
                this.updateUI();
            });
        if (this.gatepass.message) this.updateGatepassStatus(this.gatepass.message, this.gatepass.valid, this.gatepass.details);
        $('.vehicle-tagging-gatepass-input-wrapper').toggleClass('loading', Boolean(this.gatepass.pending));
        this.updateUI();
    };

    getCropSize = () => {
        const outSize = SIZES[this.currentStep] || SIZES.vehicle;
        const aspect = outSize.width / outSize.height;
        const availW = (this.elements.frame?.clientWidth || 0) - 32;
        const availH = (this.elements.frame?.clientHeight || 0) - 32;
        const width = Math.min(availW, availH * aspect);
        return { width, height: width / aspect };
    };

    clampPan = (cropSize) => {
        if (!this.canvasState.image) return;
        const maxX = Math.max(0, (this.canvasState.image.width * this.canvasState.zoom - cropSize.width) / 2);
        const maxY = Math.max(0, (this.canvasState.image.height * this.canvasState.zoom - cropSize.height) / 2);
        this.canvasState.panX = Math.min(maxX, Math.max(-maxX, this.canvasState.panX));
        this.canvasState.panY = Math.min(maxY, Math.max(-maxY, this.canvasState.panY));
    };

    syncControls = () => {
        $('.vehicle-tagging-rotation').val(this.canvasState.rotation);
        $('.vehicle-tagging-rotation-value').text(`${Math.round(this.canvasState.rotation)}°`);
        const zoomPercent = ((this.canvasState.zoom - this.canvasState.minZoom) / (this.canvasState.minZoom * 3)) * 100;
        $('.vehicle-tagging-zoom').val(Math.min(100, Math.max(0, zoomPercent)));
        $('.vehicle-tagging-zoom-value').text(`${Math.round((this.canvasState.zoom / this.canvasState.minZoom) * 100)}%`);
    };

    resizeCanvas = () => {
        if (!this.elements.frame || !this.elements.canvas || !this.elements.cropFrame || !this.canvasState.image) return;
        const ratio = window.devicePixelRatio || 1;
        const fW = this.elements.frame.clientWidth;
        const fH = this.elements.frame.clientHeight;
        const crop = this.getCropSize();

        this.elements.canvas.width = Math.round(fW * ratio);
        this.elements.canvas.height = Math.round(fH * ratio);
        this.elements.cropFrame.style.width = `${crop.width}px`;
        this.elements.cropFrame.style.height = `${crop.height}px`;
        this.clampPan(crop);
    };

    renderCanvas = () => {
        if (!this.elements.frame || !this.elements.canvas || !this.elements.cropFrame || !this.canvasState.image) return;
        const ratio = window.devicePixelRatio || 1;
        const fW = this.elements.frame.clientWidth;
        const fH = this.elements.frame.clientHeight;
        const crop = this.getCropSize();
        const ctx = this.elements.canvas.getContext('2d');

        this.clampPan(crop);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.clearRect(0, 0, fW, fH);
        ctx.save();
        ctx.translate(fW / 2 + this.canvasState.panX, fH / 2 + this.canvasState.panY);
        ctx.rotate((this.canvasState.rotation * Math.PI) / 180);
        ctx.scale(this.canvasState.zoom, this.canvasState.zoom);
        ctx.drawImage(this.canvasState.image, -this.canvasState.image.width / 2, -this.canvasState.image.height / 2);
        ctx.restore();
        this.syncControls();
    };

    resetCanvas = () => {
        if (!this.elements.frame || !this.canvasState.image) return;
        this.resizeCanvas();
        const crop = this.getCropSize();
        this.canvasState.minZoom = Math.max(crop.width / this.canvasState.image.width, crop.height / this.canvasState.image.height);
        this.canvasState.zoom = this.canvasState.minZoom;
        this.canvasState.rotation = 0;
        this.canvasState.panX = 0;
        this.canvasState.panY = 0;
        this.renderCanvas();
    };

    updateZoom = (val) => {
        this.canvasState.zoom = Math.min(this.canvasState.minZoom * 4, Math.max(this.canvasState.minZoom, val));
        this.renderCanvas();
    };

    updateRotation = (deg) => {
        this.canvasState.rotation = Math.min(180, Math.max(-180, deg));
        this.renderCanvas();
    };

    exportCroppedImage = () => {
        if (!this.elements.frame || !this.canvasState.image) return undefined;
        const outSize = SIZES[this.currentStep];
        const crop = this.getCropSize();
        const scale = outSize.width / crop.width;
        const canvas = document.createElement('canvas');
        canvas.width = outSize.width;
        canvas.height = outSize.height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.save();
        ctx.translate(outSize.width / 2 + this.canvasState.panX * scale, outSize.height / 2 + this.canvasState.panY * scale);
        ctx.rotate((this.canvasState.rotation * Math.PI) / 180);
        ctx.scale(this.canvasState.zoom * scale, this.canvasState.zoom * scale);
        ctx.drawImage(this.canvasState.image, -this.canvasState.image.width / 2, -this.canvasState.image.height / 2);
        ctx.restore();

        return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
    };

    generateLocationCard = async (imageSource, coordinates) => {
        const latitude = Number(coordinates?.latitude);
        const longitude = Number(coordinates?.longitude);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
            || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new TypeError('Valid Latitude And Longitude Are Required.');
        }

        let address = {};
        try {
            const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?${new URLSearchParams({
                location: `${longitude},${latitude}`,
                distance: '1000',
                f: 'json'
            })}`, { headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error(`ArcGIS Lookup Failed: ${response.status}.`);
            address = (await response.json()).address || {};
        } catch { }

        const cityName = address.City || address.city || address.town || address.village || address.municipality;
        const districtName = address.District || address.Subregion || address.city_district || address.county || address.state_district;
        const city = [cityName, districtName].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ') || 'Not Available';
        const street = address.Address || address.address || 'Not Available';
        const postcode = address.Postal || address.PostalCode || address.postalCode || address.postcode || address.postal_code;
        const state = address.Region || address.State || address.state;
        const stateAndPincode = [state, postcode].filter(Boolean).join(' - ') || 'Not Available';
        const countryCode = address.CountryCode || address.country_code;
        const country = address.Country || address.country || ({ IN: 'India', IND: 'India' }[countryCode] || countryCode) || 'Not Available';

        const plusCode = (() => {
            const alphabet = '23456789CFGHJMPQRVWX';
            const resolutions = [20, 1, 0.05, 0.0025];
            let lat = Math.min(90 - 1e-12, latitude) + 90;
            let lon = ((longitude + 180) % 360 + 360) % 360;
            let code = '';

            resolutions.forEach((resolution) => {
                const latDigit = Math.floor(lat / resolution);
                const lonDigit = Math.floor(lon / resolution);
                code += alphabet[latDigit] + alphabet[lonDigit];
                lat -= latDigit * resolution;
                lon -= lonDigit * resolution;
            });

            let latResolution = 0.0025;
            let lonResolution = 0.0025;
            for (let index = 0; index < 3; index += 1) {
                latResolution /= 5;
                lonResolution /= 4;
                const row = Math.min(4, Math.floor(lat / latResolution));
                const column = Math.min(3, Math.floor(lon / lonResolution));
                code += alphabet[row * 4 + column];
                lat -= row * latResolution;
                lon -= column * lonResolution;
            }
            return code.slice(4, 8) + '+' + code.slice(8);
        })();

        let imageUrl;
        const image = await new Promise((resolve, reject) => {
            const loaded = new Image();
            loaded.onload = () => resolve(loaded);
            loaded.onerror = () => reject(new Error('Could Not Load Vehicle Image.'));
            if (imageSource instanceof Blob) {
                imageUrl = URL.createObjectURL(imageSource);
                loaded.src = imageUrl;
            } else {
                loaded.src = imageSource;
            }
        });

        const canvas = document.createElement('canvas');
        canvas.width = SIZES.vehicle.width;
        canvas.height = SIZES.vehicle.height;
        const ctx = canvas.getContext('2d');
        const scale = canvas.width / 771;
        const zoom = Number(coordinates.zoom) || 1;
        const offsetX = Number(coordinates.offsetX) || 0;
        const offsetY = Number(coordinates.offsetY) || 0;
        const imageWidth = image.naturalWidth || image.width;
        const imageHeight = image.naturalHeight || image.height;
        const coverScale = Math.max(canvas.width / imageWidth, canvas.height / imageHeight) * zoom;
        const drawWidth = imageWidth * coverScale;
        const drawHeight = imageHeight * coverScale;
        const maxOffsetX = Math.max(0, (drawWidth - canvas.width) / 2);
        const maxOffsetY = Math.max(0, (drawHeight - canvas.height) / 2);

        ctx.drawImage(
            image,
            (canvas.width - drawWidth) / 2 + Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX)),
            (canvas.height - drawHeight) / 2 + Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY)),
            drawWidth,
            drawHeight
        );

        const pad = 27 * scale;
        const cardHeight = 234 * scale;
        const cardY = canvas.height - cardHeight - 36 * scale;
        const cardWidth = canvas.width - pad * 2;
        const left = 50 * scale;
        const right = 397 * scale;
        const text = (value, x, y, size, color, weight) => {
            ctx.font = `${weight} ${size * scale}px sans-serif`;
            ctx.fillStyle = color;
            ctx.fillText(value, x * scale, cardY + y * scale);
        };
        const fittedText = (value, x, y, size, color, weight, maxWidth) => {
            let fittedSize = size;
            do {
                ctx.font = `${weight} ${fittedSize * scale}px sans-serif`;
                fittedSize -= 0.5;
            } while (fittedSize > 10 && ctx.measureText(value).width > maxWidth * scale);
            ctx.fillStyle = color;
            ctx.fillText(value, x * scale, cardY + y * scale);
        };
        const label = (value, x, y) => text(value, x, y, 12, '#bababa', '400');

        ctx.beginPath();
        ctx.roundRect(pad, cardY, cardWidth, cardHeight, 18 * scale);
        ctx.fillStyle = 'rgba(8, 8, 8, 0.91)';
        ctx.fill();
        ctx.lineWidth = 3 * scale;
        ctx.strokeStyle = '#11b9c2';
        ctx.stroke();

        text(`📍  ${plusCode}`, left, 50, 23, '#fff', '700');
        label('STREET', left, 87);
        fittedText(street, left, 108, 17, '#fff', '600', 315);
        label('CITY / DISTRICT', left, 146);
        fittedText(city, left, 167, 17, '#fff', '600', 315);
        label('STATE & PINCODE', right, 87);
        fittedText(stateAndPincode, right, 108, 17, '#fff', '600', 315);
        label('COUNTRY', right, 146);
        fittedText(country, right, 167, 17, '#fff', '600', 315);

        ctx.strokeStyle = 'rgba(255,255,255,0.22)';
        ctx.lineWidth = scale;
        ctx.beginPath();
        ctx.moveTo(left * scale, cardY + 195 * scale);
        ctx.lineTo(pad + cardWidth - 24 * scale, cardY + 195 * scale);
        ctx.stroke();
        text(`GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, left, 222, 19, '#11dbe7', '700');

        return new Promise((resolve) => canvas.toBlob((blob) => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            resolve(blob);
        }, 'image/png'));
    };

    setupCanvasInteractions = () => {
        this.cleanInteractions?.();
        if (!this.elements.canvas) return;

        const pointers = new Map();
        let drag = null;
        let pinch = null;

        const onPointerDown = (e) => {
            this.elements.canvas.setPointerCapture(e.pointerId);
            pointers.set(e.pointerId, e);

            if (pointers.size === 1) {
                drag = { startX: e.clientX, startY: e.clientY, panX: this.canvasState.panX, panY: this.canvasState.panY };
                pinch = null;
            } else if (pointers.size === 2) {
                const [p1, p2] = [...pointers.values()];
                pinch = {
                    dist: Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY),
                    zoom: this.canvasState.zoom,
                    angle: Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX),
                    rot: this.canvasState.rotation,
                    center: { x: (p1.clientX + p2.clientX) / 2, y: (p1.clientY + p2.clientY) / 2 },
                    panX: this.canvasState.panX,
                    panY: this.canvasState.panY
                };
                drag = null;
            }
        };

        const onPointerMove = (e) => {
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, e);

            if (pointers.size === 1 && drag) {
                this.canvasState.panX = drag.panX + e.clientX - drag.startX;
                this.canvasState.panY = drag.panY + e.clientY - drag.startY;
                this.renderCanvas();
            } else if (pointers.size === 2 && pinch) {
                const [p1, p2] = [...pointers.values()];
                const currDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
                const currAngle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX);
                const currCenter = { x: (p1.clientX + p2.clientX) / 2, y: (p1.clientY + p2.clientY) / 2 };

                this.canvasState.zoom = Math.min(this.canvasState.minZoom * 4, Math.max(this.canvasState.minZoom, pinch.zoom * (currDist / pinch.dist)));
                this.canvasState.rotation = pinch.rot + ((currAngle - pinch.angle) * 180) / Math.PI;
                this.canvasState.panX = pinch.panX + currCenter.x - pinch.center.x;
                this.canvasState.panY = pinch.panY + currCenter.y - pinch.center.y;
                this.renderCanvas();
            }
        };

        const onPointerUp = (e) => {
            pointers.delete(e.pointerId);
            try { this.elements.canvas.releasePointerCapture(e.pointerId); } catch (_) { }

            if (pointers.size === 1) {
                const [p] = [...pointers.values()];
                drag = { startX: p.clientX, startY: p.clientY, panX: this.canvasState.panX, panY: this.canvasState.panY };
                pinch = null;
            } else if (pointers.size === 0) {
                drag = null;
                pinch = null;
            }
        };

        const onWheel = (e) => {
            e.preventDefault();
            const factor = 1.07;
            this.updateZoom(e.deltaY < 0 ? this.canvasState.zoom * factor : this.canvasState.zoom / factor);
        };

        this.elements.canvas.addEventListener('pointerdown', onPointerDown);
        this.elements.canvas.addEventListener('pointermove', onPointerMove);
        this.elements.canvas.addEventListener('pointerup', onPointerUp);
        this.elements.canvas.addEventListener('pointercancel', onPointerUp);
        this.elements.canvas.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('resize', this.resetCanvas);

        this.cleanInteractions = () => {
            this.elements.canvas?.removeEventListener('pointerdown', onPointerDown);
            this.elements.canvas?.removeEventListener('pointermove', onPointerMove);
            this.elements.canvas?.removeEventListener('pointerup', onPointerUp);
            this.elements.canvas?.removeEventListener('pointercancel', onPointerUp);
            this.elements.canvas?.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', this.resetCanvas);
        };
    };

    close = () => {
        this.cleanInteractions?.();
        this.cleanInteractions = null;
        this.cleanupMedia();
        this.canvasState.image = null;
        this.locationPending = false;
        this.elements = { frame: null, canvas: null, cropFrame: null };
        $(MODAL_SEL).remove();
    };

    renderEditorStep = () => {
        $('.vehicle-tagging-modal-content').html(vehicleTaggingEditor);
        this.elements.frame = $('.vehicle-tagging-image-container')[0];
        this.elements.canvas = $('.vehicle-tagging-canvas')[0];
        this.elements.cropFrame = $('.vehicle-tagging-crop-frame')[0];
    };

    renderReviewStep = () => {
        this.cleanInteractions?.();
        this.cleanInteractions = null;
        this.media.reviewUrls.forEach((url) => URL.revokeObjectURL(url));
        this.media.reviewUrls = [
            URL.createObjectURL(this.media.finalized.vehicleFull || this.media.finalized.vehicle),
            URL.createObjectURL(this.media.finalized.plate)
        ];

        $('.vehicle-tagging-modal-content').html(vehicleTaggingReview(this.media.reviewUrls[0], this.media.reviewUrls[1]));

        const reviewGatepassNumber = this.gatepass.number || $('#transaction_number').val() || '';
        const pageGatepassNumber = String($('#transaction_number').val() || '').trim();
        const vehicleType = this.gatepass.data?.vehicleName || 'Vehicle';
        const vehicleNumber = String(this.gatepass.data?.vehicleNumber || '').trim();
        const pageVehicleNumber = String($('#vehicle_no').val() || '').trim();
        const vehicleDetails = vehicleNumber ? `${vehicleType} - ${vehicleNumber}` : 'Not Available';
        const vehicleMatchesPage = Boolean(vehicleNumber && pageVehicleNumber && vehicleNumber === pageVehicleNumber);

        $('.vehicle-tagging-review-vehicle-details-value').text(vehicleDetails);
        $('.vehicle-tagging-vehicle-details-card')
            .toggleClass('is-match', vehicleMatchesPage)
            .toggleClass('is-mismatch', Boolean(vehicleNumber) && !vehicleMatchesPage);

        const gatepassMatchesPage = Boolean(reviewGatepassNumber && pageGatepassNumber && reviewGatepassNumber.trim() === pageGatepassNumber);
        $('.vehicle-tagging-review-gatepass-value').text(reviewGatepassNumber || 'Not Available');
        $('.vehicle-tagging-gatepass-card')
            .toggleClass('is-match', gatepassMatchesPage)
            .toggleClass('is-mismatch', Boolean(reviewGatepassNumber) && !gatepassMatchesPage);

        $('.vehicle-tagging-review-gps-value').text(this.selectedCoordinates
            ? `${this.selectedCoordinates.latitude}, ${this.selectedCoordinates.longitude}`
            : 'Not available');

        $('.vehicle-tagging-next').prop('disabled', !this.gatepass.data || this.locationPending);
    };

    updateUI = () => {
        const titles = {
            manual: Labels.ValidateGatepass,
            vehicle: Labels.VehicleTagging,
            plate: Labels.NumberPlateTagging,
            location: Labels.SelectLocation,
            review: Labels.ReviewVehicleTagging
        };
        const nextLabels = {
            manual: Labels.Next,
            vehicle: Labels.Next,
            plate: Labels.Next,
            location: Labels.Review,
            review: Labels.TagVehicle
        };

        $('.vehicle-tagging-title').text(titles[this.currentStep]);
        $('.vehicle-tagging-direct-finalize-card').toggle(Boolean(this.record)).toggleClass('is-checked', this.directFinalize);
        $('.vehicle-tagging-direct-finalize-checkbox').prop('checked', this.directFinalize);

        if (this.directFinalize) {
            $('.vehicle-tagging-next-label').text(Labels.Finalize);
            $('.vehicle-tagging-next i').attr('class', 'fa fa-check');
            $('.vehicle-tagging-next').addClass('is-finalize').prop('disabled', !this.record);
        } else {
            $('.vehicle-tagging-next-label').text(nextLabels[this.currentStep]);
            $('.vehicle-tagging-next i').attr('class', 'fa fa-arrow-right');
            $('.vehicle-tagging-next').removeClass('is-finalize').prop('disabled', this.currentStep === 'manual'
                ? !this.manualImagesReady() || !this.gatepass.valid || this.gatepass.pending
                : this.currentStep === 'review'
                    ? !this.gatepass.data || this.locationPending
                    : this.manualMode && !this.manualImagesReady());
        }

        $('.vehicle-tagging-back').toggle(this.currentStep !== 'manual');
        $('.vehicle-tagging-controls').toggle(['vehicle', 'plate'].includes(this.currentStep) && !this.imageError && !this.manualMode);
        $('.vehicle-tagging-reload').toggle(this.currentStep === 'manual' || (['vehicle', 'plate', 'location'].includes(this.currentStep) && !this.imageError && !this.manualMode));
    };

    loadVehicleTaggingImage = (type) => {
        const image = this.media.raw[type];
        if (!image) throw new Error(`The ${capitalize(type)} Image Has Not Been Preloaded.`);

        this.canvasState.image = image;
        this.setupCanvasInteractions();
        this.resetCanvas();
    };

    updateLocationMap = () => {
        const latitude = Number($('.vehicle-tagging-latitude').val());
        const longitude = Number($('.vehicle-tagging-longitude').val());
        if (!validCoordinates({ latitude, longitude })) return;
        this.selectedCoordinates = { latitude: latitude.toFixed(7), longitude: longitude.toFixed(7) };
        $('.vehicle-tagging-map').attr('src', `https://maps.google.com/maps?${new URLSearchParams({ q: `${latitude},${longitude}`, z: '15', output: 'embed' })}`);
    };

    renderLocationStep = () => {
        this.selectedCoordinates = validCoordinates(this.selectedCoordinates) ? this.selectedCoordinates : this.getInitialCoordinates();
        $('.vehicle-tagging-modal-content').html(vehicleTaggingLocation);
        $('.vehicle-tagging-latitude').val(this.selectedCoordinates.latitude);
        $('.vehicle-tagging-longitude').val(this.selectedCoordinates.longitude);
        $('.vehicle-tagging-latitude, .vehicle-tagging-longitude').off('input.vehicleTagging').on('input.vehicleTagging', this.updateLocationMap);
        $('.vehicle-tagging-randomize').off('click.vehicleTagging').on('click.vehicleTagging', () => {
            this.selectedCoordinates = randomizeCoordinates(LOCATION_SEED);
            $('.vehicle-tagging-latitude').val(this.selectedCoordinates.latitude);
            $('.vehicle-tagging-longitude').val(this.selectedCoordinates.longitude);
            this.updateLocationMap();
        });
        $('.vehicle-tagging-reload').off('click.vehicleTagging').on('click.vehicleTagging', () => {
            this.selectedCoordinates = this.getInitialCoordinates();
            $('.vehicle-tagging-latitude').val(this.selectedCoordinates.latitude);
            $('.vehicle-tagging-longitude').val(this.selectedCoordinates.longitude);
            this.updateLocationMap();
        });
        this.updateLocationMap();
    };

    setStep = (step) => {
        const prev = this.currentStep;
        this.currentStep = step;
        this.updateUI();

        if (step === 'review') {
            this.renderReviewStep();
            return;
        }

        if (step === 'location') {
            this.renderLocationStep();
            return;
        }

        if (step === 'manual') {
            this.renderManualStep(this.imageError || (this.manualImagesReady()
                ? this.getImageReadyMessage()
                : Messages.ImagesNotAvailableManual));
            $('.vehicle-tagging-reload').off('click.vehicleTagging').on('click.vehicleTagging', this.reloadStepZero);
            return;
        }

        this.renderEditorStep();
        $('.vehicle-tagging-reload').off('click.vehicleTagging').on('click.vehicleTagging', this.resetCanvas);
        showLoader(step === 'vehicle' ? Messages.LoadingVehicleImage : Messages.LoadingNumberPlateImage);
        try {
            this.loadVehicleTaggingImage(step);
        } catch (err) {
            this.currentStep = prev;
            this.updateUI();
            throw err;
        } finally {
            hideLoader();
        }
    };

    handleActionError = (error) => {
        if (error.message?.toLowerCase().includes('image')) {
            this.manualMode = true;
            this.imageError = error.message;
            this.renderManualStep(this.imageError);
            this.updateUI();
            return;
        }
        alertError(error);
    };

    handleNext = async () => {
        if (this.currentStep === 'manual') {
            this.resumeManualPipeline();
            return;
        }

        if (this.currentStep === 'location') {
            this.locationPending = true;
            this.setStep('review');
            void this.generateLocationCard(this.media.finalized.vehicle, this.selectedCoordinates)
                .then((image) => {
                    this.media.finalized.vehicleFull = image;
                    const stampedUrl = URL.createObjectURL(image);
                    if (this.media.reviewUrls[0]) URL.revokeObjectURL(this.media.reviewUrls[0]);
                    this.media.reviewUrls[0] = stampedUrl;
                    $('.vehicle-review-item img').attr('src', stampedUrl);
                })
                .catch(alertError)
                .finally(() => {
                    this.locationPending = false;
                    this.updateUI();
                });
            return;
        }

        const image = await this.exportCroppedImage();
        if (!image) throw new Error('Unable To Finalize The Current Image.');

        if (this.currentStep === 'vehicle') {
            this.media.finalized.vehicle = image;
            this.setStep('plate');
        } else if (this.currentStep === 'plate') {
            this.media.finalized.plate = image;
            this.setStep('location');
        }
    };

    handleBack = async () => {
        if (this.currentStep === 'review') {
            this.setStep('location');
        } else if (this.currentStep === 'vehicle') {
            this.setStep('manual');
        } else if (this.currentStep === 'plate') {
            this.setStep('vehicle');
        } else if (this.currentStep === 'location') {
            this.setStep('plate');
        }
    };

    handleReview = async () => {
        const [vehicleImage, plateImage] = await Promise.all([
            blobToBase64(this.media.finalized.vehicleFull),
            blobToBase64(this.media.finalized.plate)
        ]);

        const payload = {
            ContactNumber: '9675679250',
            InstrumentNumber: this.gatepass.number || $('#transaction_number').val(),
            InstrumentType: 1,
            InstrumentTypeName: 'Gatepass',
            VehicleTypeId: this.gatepass.data?.vehicleId,
            VehicleTypeName: this.gatepass.data?.vehicleName,
            VehicleNumber: this.gatepass.data?.vehicleNumber,
            Latitude: this.selectedCoordinates?.latitude || Number(LOCATION_SEED.latitude).toFixed(7),
            Longitude: this.selectedCoordinates?.longitude || Number(LOCATION_SEED.longitude).toFixed(7),
            IPAddress: null,
            VehicleImage: plateImage,
            VehicleFullImage: vehicleImage
        };

        showLoader(Messages.TaggingVehicle);
        sendVehicleTaggingRequest('InsertVehcileTaggingData', payload)
            .then(async () => {
                showAlert(MessageType.Success, Messages.VehicleTagged);
                await this.finalizeRecord();
            }).catch(alertError).finally(hideLoader);
    };

    finalizeRecord = async () => {
        const date = gatepassDateFormatter($('#dateofissue').val());
        const ninerNumber = $('#nine_r_id').val();
        const gatepassNumber = this.gatepass?.number || $('.vehicle-tagging-gatepass-input').val() || $('#transaction_number').val();

        showLoader(Messages.SendingNiner);
        await sendNinerBySerialNumber(ninerNumber, date, false, false, true).catch(alertError);

        showLoader(Messages.SendingGatepass);
        await sendGatepassBySerialNumber(gatepassNumber, date, false, false, true).catch(alertError);

        if (this.record) {
            showLoader(Messages.FinalizingRecord);
            await sendRequest(Url.FinalizeRecord, {
                ...FetchParams.Patch,
                body: JSON.stringify({ rate: this.record.rate ?? 0, ninerId: ninerNumber, gatepassId: gatepassNumber })
            }).then(() => {
                this.removeRecord();
                this.onComplete();
            }).catch(alertError);
        }
        else this.onComplete();
    };

    onComplete = () => {
        hideLoader();
        this.close();
        showAlert(MessageType.Success, Messages.GatepassProvisioned);
        location.href = "/Traders/Dashboard";
    };

    bindControls = () => {
        $('.vehicle-tagging-rotation')
            .off('input.vehicleTagging')
            .on('input.vehicleTagging', ({ target }) => this.updateRotation(Number(target.value)));
        $('.vehicle-tagging-zoom')
            .off('input.vehicleTagging')
            .on('input.vehicleTagging', ({ target }) => {
                this.updateZoom(this.canvasState.minZoom + this.canvasState.minZoom * 3 * (Number(target.value) / 100));
            });

        $('.vehicle-tagging-zoom-decrease')
            .off('click.vehicleTagging')
            .on('click.vehicleTagging', () => this.updateZoom(this.canvasState.zoom - this.canvasState.minZoom * 0.05));
        $('.vehicle-tagging-zoom-increase')
            .off('click.vehicleTagging')
            .on('click.vehicleTagging', () => this.updateZoom(this.canvasState.zoom + this.canvasState.minZoom * 0.05));
        $('.vehicle-tagging-rotation-decrease')
            .off('click.vehicleTagging')
            .on('click.vehicleTagging', () => this.updateRotation(this.canvasState.rotation - 1));
        $('.vehicle-tagging-rotation-increase')
            .off('click.vehicleTagging')
            .on('click.vehicleTagging', () => this.updateRotation(this.canvasState.rotation + 1));
    };

    renderModal = () => {
        if ($(MODAL_SEL).length) return;
        $(vehicleTaggingModal).appendTo(document.body);
        $(MODAL_SEL).find('.custom-modal-header .link').click(this.close);
        this.renderEditorStep();
    };

    initialize = async () => {
        this.resetState();
        this.record = await this.getRecord();

        this.renderModal();
        this.bindControls();
        this.renderManualStep(Messages.FetchingImages);
        $('.vehicle-tagging-reload').off('click.vehicleTagging').on('click.vehicleTagging', this.reloadStepZero);
        $('.vehicle-tagging-direct-finalize-checkbox')
            .off('change.vehicleTagging')
            .on('change.vehicleTagging', ({ target }) => {
                this.directFinalize = target.checked;
                this.updateUI();
            });

        $('.vehicle-tagging-next').off('click').on('click', async () => {
            if (this.directFinalize) {
                await this.finalizeRecord();
            } else {
                (this.currentStep === 'review' ? this.handleReview() : this.handleNext()).catch(this.handleActionError);
            }
        });
        $('.vehicle-tagging-back').off('click').on('click', () => {
            this.handleBack().catch(this.handleActionError);
        });

        this.updateUI();
        Promise.all([this.loadRecordImages(), this.validateGatepass()]).finally(this.updateUI);
    };
}

export const vehicleTagging = new VehicleTagging();
