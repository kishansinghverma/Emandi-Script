import { Url } from "../constants.js";
import { alertError, hideLoader, showLoader } from "./utils.js";

const MODAL_SEL = '.vehicle-tagging-modal';
const SIZES = {
    vehicle: { width: 771, height: 1024 },
    plate: { width: 341, height: 195 }
};

let currentStep = 'vehicle';
let cleanInteractions;
const preloadedUrls = {};
const preloadedImages = {};
const reviewUrls = [];
const finalizedImages = { vehicleImage: undefined, plateImage: undefined };

const state = {
    image: null,
    zoom: 1,
    minZoom: 1,
    rotation: 0,
    panX: 0,
    panY: 0
};

let frameEl;
let canvasEl;
let cropFrameEl;

const MODAL_HTML = `
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

const EDITOR_HTML = `
<div class="vehicle-tagging-image-container">
    <canvas class="vehicle-tagging-canvas" role="img" aria-label="Vehicle image"></canvas>
    <div class="vehicle-tagging-crop-frame" aria-hidden="true">
        <span class="vehicle-tagging-grid vertical-one"></span>
        <span class="vehicle-tagging-grid vertical-two"></span>
        <span class="vehicle-tagging-grid horizontal-one"></span>
        <span class="vehicle-tagging-grid horizontal-two"></span>
    </div>
</div>`;

const getOutputSize = () => SIZES[currentStep];

const getCropSize = (frame) => {
    const { width: outW, height: outH } = getOutputSize();
    const aspect = outW / outH;
    const availW = frame.clientWidth - 32;
    const availH = frame.clientHeight - 32;
    const width = Math.min(availW, availH * aspect);
    return { width, height: width / aspect };
};

const clearReviewUrls = () => {
    reviewUrls.splice(0).forEach((url) => URL.revokeObjectURL(url));
};

const clearPreloadedImages = () => {
    Object.keys(preloadedImages).forEach((key) => delete preloadedImages[key]);
};

const clearPreloadedUrls = () => {
    Object.values(preloadedUrls).forEach((url) => URL.revokeObjectURL(url));
    Object.keys(preloadedUrls).forEach((key) => delete preloadedUrls[key]);
    clearPreloadedImages();
};

const clampPan = (cropSize) => {
    if (!state.image) return;
    const maxX = Math.max(0, (state.image.width * state.zoom - cropSize.width) / 2);
    const maxY = Math.max(0, (state.image.height * state.zoom - cropSize.height) / 2);
    state.panX = Math.min(maxX, Math.max(-maxX, state.panX));
    state.panY = Math.min(maxY, Math.max(-maxY, state.panY));
};

const syncControls = () => {
    $('.vehicle-tagging-rotation').val(state.rotation);
    $('.vehicle-tagging-rotation-value').text(`${Math.round(state.rotation)}°`);
    const zoomPercent = ((state.zoom - state.minZoom) / (state.minZoom * 3)) * 100;
    $('.vehicle-tagging-zoom').val(Math.min(100, Math.max(0, zoomPercent)));
    $('.vehicle-tagging-zoom-value').text(`${Math.round((state.zoom / state.minZoom) * 100)}%`);
};

const resizeCanvas = () => {
    if (!frameEl || !canvasEl || !cropFrameEl || !state.image) return;

    const ratio = window.devicePixelRatio || 1;
    const fW = frameEl.clientWidth;
    const fH = frameEl.clientHeight;
    const crop = getCropSize(frameEl);

    canvasEl.width = Math.round(fW * ratio);
    canvasEl.height = Math.round(fH * ratio);
    cropFrameEl.style.width = `${crop.width}px`;
    cropFrameEl.style.height = `${crop.height}px`;
    clampPan(crop);
};

const renderImage = () => {
    if (!frameEl || !canvasEl || !cropFrameEl || !state.image) return;

    const ratio = window.devicePixelRatio || 1;
    const fW = frameEl.clientWidth;
    const fH = frameEl.clientHeight;
    const crop = getCropSize(frameEl);
    const ctx = canvasEl.getContext('2d');

    clampPan(crop);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, fW, fH);
    ctx.save();
    ctx.translate(fW / 2 + state.panX, fH / 2 + state.panY);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.zoom, state.zoom);
    ctx.drawImage(state.image, -state.image.width / 2, -state.image.height / 2);
    ctx.restore();
    syncControls();
};

const resetImage = () => {
    if (!frameEl || !state.image) return;
    resizeCanvas();
    const crop = getCropSize(frameEl);
    state.minZoom = Math.max(crop.width / state.image.width, crop.height / state.image.height);
    state.zoom = state.minZoom;
    state.rotation = 0;
    state.panX = 0;
    state.panY = 0;
    renderImage();
};

const updateZoom = (val) => {
    state.zoom = Math.min(state.minZoom * 4, Math.max(state.minZoom, val));
    renderImage();
};

const updateRotation = (deg) => {
    state.rotation = Math.min(180, Math.max(-180, deg));
    renderImage();
};

const getVehicleTaggingImage = () => {
    if (!frameEl || !state.image) return undefined;

    const { width: outW, height: outH } = getOutputSize();
    const crop = getCropSize(frameEl);
    const scale = outW / crop.width;
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.save();
    ctx.translate(outW / 2 + state.panX * scale, outH / 2 + state.panY * scale);
    ctx.rotate((state.rotation * Math.PI) / 180);
    ctx.scale(state.zoom * scale, state.zoom * scale);
    ctx.drawImage(state.image, -state.image.width / 2, -state.image.height / 2);
    ctx.restore();

    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
};

const setupImageInteractions = () => {
    cleanInteractions?.();
    if (!canvasEl) return;

    const pointers = new Map();
    let drag = null;
    let pinch = null;

    const onPointerDown = (e) => {
        canvasEl.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, e);

        if (pointers.size === 1) {
            drag = { startX: e.clientX, startY: e.clientY, panX: state.panX, panY: state.panY };
            pinch = null;
        } else if (pointers.size === 2) {
            const [p1, p2] = [...pointers.values()];
            pinch = {
                dist: Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY),
                zoom: state.zoom,
                angle: Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX),
                rot: state.rotation,
                center: { x: (p1.clientX + p2.clientX) / 2, y: (p1.clientY + p2.clientY) / 2 },
                panX: state.panX,
                panY: state.panY
            };
            drag = null;
        }
    };

    const onPointerMove = (e) => {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, e);

        if (pointers.size === 1 && drag) {
            state.panX = drag.panX + e.clientX - drag.startX;
            state.panY = drag.panY + e.clientY - drag.startY;
            renderImage();
        } else if (pointers.size === 2 && pinch) {
            const [p1, p2] = [...pointers.values()];
            const currDist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
            const currAngle = Math.atan2(p2.clientY - p1.clientY, p2.clientX - p1.clientX);
            const currCenter = { x: (p1.clientX + p2.clientX) / 2, y: (p1.clientY + p2.clientY) / 2 };

            state.zoom = Math.min(state.minZoom * 4, Math.max(state.minZoom, pinch.zoom * (currDist / pinch.dist)));
            state.rotation = pinch.rot + ((currAngle - pinch.angle) * 180) / Math.PI;
            state.panX = pinch.panX + currCenter.x - pinch.center.x;
            state.panY = pinch.panY + currCenter.y - pinch.center.y;
            renderImage();
        }
    };

    const onPointerUp = (e) => {
        pointers.delete(e.pointerId);
        try { canvasEl.releasePointerCapture(e.pointerId); } catch (_) {}

        if (pointers.size === 1) {
            const [p] = [...pointers.values()];
            drag = { startX: p.clientX, startY: p.clientY, panX: state.panX, panY: state.panY };
            pinch = null;
        } else if (pointers.size === 0) {
            drag = null;
            pinch = null;
        }
    };

    const onWheel = (e) => {
        e.preventDefault();
        const factor = 1.07;
        updateZoom(e.deltaY < 0 ? state.zoom * factor : state.zoom / factor);
    };

    canvasEl.addEventListener('pointerdown', onPointerDown);
    canvasEl.addEventListener('pointermove', onPointerMove);
    canvasEl.addEventListener('pointerup', onPointerUp);
    canvasEl.addEventListener('pointercancel', onPointerUp);
    canvasEl.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', resetImage);

    cleanInteractions = () => {
        canvasEl?.removeEventListener('pointerdown', onPointerDown);
        canvasEl?.removeEventListener('pointermove', onPointerMove);
        canvasEl?.removeEventListener('pointerup', onPointerUp);
        canvasEl?.removeEventListener('pointercancel', onPointerUp);
        canvasEl?.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', resetImage);
    };
};

const closeModal = () => {
    cleanInteractions?.();
    cleanInteractions = undefined;
    clearReviewUrls();
    clearPreloadedUrls();
    state.image = null;
    finalizedImages.vehicleImage = undefined;
    finalizedImages.plateImage = undefined;
    frameEl = undefined;
    canvasEl = undefined;
    cropFrameEl = undefined;
    $(MODAL_SEL).remove();
};

const renderImageEditor = () => {
    $('.vehicle-tagging-modal-content').html(EDITOR_HTML);
    frameEl = $('.vehicle-tagging-image-container')[0];
    canvasEl = $('.vehicle-tagging-canvas')[0];
    cropFrameEl = $('.vehicle-tagging-crop-frame')[0];
};

const renderReviewStep = () => {
    cleanInteractions?.();
    cleanInteractions = undefined;
    clearReviewUrls();
    reviewUrls.push(
        URL.createObjectURL(finalizedImages.vehicleImage),
        URL.createObjectURL(finalizedImages.plateImage)
    );
    $('.vehicle-tagging-modal-content').html(`
        <div class="vehicle-tagging-review-container">
            <div class="vehicle-tagging-review">
                <div class="vehicle-tagging-review-item vehicle-review-item">
                    <span>Vehicle Image</span>
                    <img src="${reviewUrls[0]}" alt="Finalized Vehicle Image" />
                </div>
                <div class="vehicle-tagging-review-item plate-review-item">
                    <span>Number Plate Image</span>
                    <img src="${reviewUrls[1]}" alt="Finalized Number Plate Image" />
                </div>
            </div>
        </div>
    `);
};

const updateModalUI = () => {
    const titles = { vehicle: 'Vehicle Tagging', plate: 'Number Plate Tagging', review: 'Review Vehicle Tagging' };
    const nextLabels = { vehicle: 'Next', plate: 'Review', review: 'Tag Vehicle' };

    $('.vehicle-tagging-title').text(titles[currentStep]);
    $('.vehicle-tagging-next-label').text(nextLabels[currentStep]);
    $('.vehicle-tagging-back').toggle(currentStep !== 'vehicle');
    $('.vehicle-tagging-controls').toggle(currentStep !== 'review');
    $('.vehicle-tagging-reload').toggle(currentStep !== 'review');
};

const loadVehicleTaggingImage = (type) => {
    const image = preloadedImages[type];
    if (!image) throw new Error(`The ${type} image has not been preloaded.`);

    state.image = image;
    setupImageInteractions();
    resetImage();
};

const setStep = (step) => {
    const prev = currentStep;
    currentStep = step;
    updateModalUI();

    if (step === 'review') {
        renderReviewStep();
        return;
    }

    renderImageEditor();
    showLoader(`Loading ${step === 'vehicle' ? 'vehicle' : 'number plate'} image...`);
    try {
        loadVehicleTaggingImage(step);
    } catch (err) {
        currentStep = prev;
        updateModalUI();
        throw err;
    } finally {
        hideLoader();
    }
};

const handleNext = async () => {
    const image = await getVehicleTaggingImage();
    if (!image) throw new Error('Unable to finalize the current image.');

    if (currentStep === 'vehicle') {
        finalizedImages.vehicleImage = image;
        setStep('plate');
    } else if (currentStep === 'plate') {
        finalizedImages.plateImage = image;
        setStep('review');
    }
};

const handleBack = async () => {
    if (currentStep === 'review') {
        setStep('plate');
    } else if (currentStep === 'plate') {
        setStep('vehicle');
    }
};

const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

const handleReview = async () => {
    const [vehicleImage, plateImage] = await Promise.all([
        blobToBase64(finalizedImages.vehicleImage),
        blobToBase64(finalizedImages.plateImage)
    ]);
    console.log('Vehicle tagging images:', { vehicleImage, plateImage });
};

const bindControls = () => {
    $('.vehicle-tagging-rotation')
        .off('input.vehicleTagging')
        .on('input.vehicleTagging', ({ target }) => updateRotation(Number(target.value)));
    $('.vehicle-tagging-zoom')
        .off('input.vehicleTagging')
        .on('input.vehicleTagging', ({ target }) => {
            updateZoom(state.minZoom + state.minZoom * 3 * (Number(target.value) / 100));
        });

    $('.vehicle-tagging-zoom-decrease')
        .off('click.vehicleTagging')
        .on('click.vehicleTagging', () => updateZoom(state.zoom - state.minZoom * 0.05));
    $('.vehicle-tagging-zoom-increase')
        .off('click.vehicleTagging')
        .on('click.vehicleTagging', () => updateZoom(state.zoom + state.minZoom * 0.05));
    $('.vehicle-tagging-rotation-decrease')
        .off('click.vehicleTagging')
        .on('click.vehicleTagging', () => updateRotation(state.rotation - 1));
    $('.vehicle-tagging-rotation-increase')
        .off('click.vehicleTagging')
        .on('click.vehicleTagging', () => updateRotation(state.rotation + 1));
};

const preloadImage = async (type, path) => {
    if (!path) throw new Error(`No ${type} image is available.`);
    const response = await fetch(`${Url.GetS3File}?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error(`Unable to load the ${type} image.`);

    const url = URL.createObjectURL(await response.blob());
    const image = new Image();
    try {
        await new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
            image.src = url;
        });
    } catch (error) {
        URL.revokeObjectURL(url);
        throw error;
    }
    preloadedUrls[type] = url;
    preloadedImages[type] = image;
};

const preloadAll = (record) => Promise.all([
    preloadImage('vehicle', record.rawVehicleImage),
    preloadImage('plate', record.rawNumberPlateImage)
]).catch((error) => {
    clearPreloadedUrls();
    throw error;
});

const renderVehicleTaggingModal = () => {
    if ($(MODAL_SEL).length) return;
    $(MODAL_HTML).appendTo(document.body);
    $(MODAL_SEL).find('.custom-modal-header .link').click(closeModal);
    $(MODAL_SEL).find('.vehicle-tagging-reload').click(resetImage);
    renderImageEditor();
};

export const initializeVehicleTagging = (record) => {
    const hasImages = record?.rawVehicleImage && record?.rawNumberPlateImage;
    if (!hasImages) return;

    currentStep = 'vehicle';
    finalizedImages.vehicleImage = undefined;
    finalizedImages.plateImage = undefined;
    clearReviewUrls();
    clearPreloadedUrls();

    renderVehicleTaggingModal();
    bindControls();

    $('.vehicle-tagging-next').off('click').on('click', () => {
        (currentStep === 'review' ? handleReview() : handleNext()).catch(alertError);
    });
    $('.vehicle-tagging-back').off('click').on('click', () => {
        handleBack().catch(alertError);
    });

    updateModalUI();
    showLoader('Loading vehicle images...');
    preloadAll(record)
        .then(() => loadVehicleTaggingImage('vehicle'))
        .catch(alertError)
        .finally(hideLoader);
};
