export class ComplexPromise {
    constructor() {
        this.operator = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        })
    }
}

export const formatDate = (date) => {
    if (!date) return undefined;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export const formatIsoString = (isoDate) => {
    if (typeof isoDate !== 'string') return undefined;

    const legacyDate = isoDate.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (legacyDate) return `${legacyDate[1].padStart(2, '0')}-${legacyDate[2].padStart(2, '0')}-${legacyDate[3]}`;

    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(isoDate)) return undefined;

    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return undefined;

    return formatDate(date);
}

export const ninerDateFormatter = (value) => {
    const isValid = /^\d{2}\/\d{2}\/\d{4}/.test(value);
    if (!isValid) return null;

    const [month, day, year] = value.split(' ')[0].split('/');
    return `${year}-${month}-${day}`;
}

export const gatepassDateFormatter = (value) => {
    const isValid = /^\d{2}\/\d{2}\/\d{4}/.test(value);
    if (!isValid) return null;

    const [day, month, year] = value.split(' ')[0].split('/');
    return `${year}-${month}-${day}`;
}

export const getNestedValue = (path, record) => (path.split('.').reduce((o, k) => o && o[k], record) ?? '');

export const capitalize = (str) => {
    const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result.trim();
}

export const getActionButton = (icon, color, title, handler) => $('<button>', {
    title,
    type: 'button',
    class: `btn btn-sm ${color}`
}).append($('<i>').addClass(`fa ${icon}`)).click(handler);

export const imageLabel = (type) => type === 'plate' ? 'Number plate' : 'Vehicle';

export const validCoordinates = (value) => {
    const latitude = Number(value?.latitude);
    const longitude = Number(value?.longitude);
    return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
        && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
};

export const randomizeCoordinates = ({ latitude, longitude }, maxDistanceKm = 0.1) => {
    const earthRadiusKm = 6371;
    const distance = Math.sqrt(Math.random()) * maxDistanceKm;
    const bearing = Math.random() * Math.PI * 2;
    const lat1 = Number(latitude) * Math.PI / 180;
    const lon1 = Number(longitude) * Math.PI / 180;
    const angularDistance = distance / earthRadiusKm;
    const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance)
        + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
    );
    const lon2 = lon1 + Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
    );
    return {
        latitude: (lat2 * 180 / Math.PI).toFixed(7),
        longitude: (lon2 * 180 / Math.PI).toFixed(7)
    };
};

export const blobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
});

export const parseErrorResponse = async (response) => {
    const body = await response.text();
    if (!body) return undefined;

    try {
        const parsed = JSON.parse(body);
        return parsed.message || parsed.error || parsed.title;
    } catch (_) {
        return body.trim() || undefined;
    }
};

export const getImageLoadError = async (type, response) => {
    const label = imageLabel(type);
    if (!response) return `Unable To Load ${capitalize(label)} Image.`;
    if (response.status === 404) return `${capitalize(label)} Image Not Available.`;

    const backendMessage = await parseErrorResponse(response);
    return backendMessage || `Unable To Load ${capitalize(label)} Image.`;
};
