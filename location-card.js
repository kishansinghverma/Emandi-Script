/**
 * Draw a location card over an image using the browser Canvas API.
 * No dependencies are required.
 *
 * Example:
 * const output = await createLocationCard('truck.png', {
 *   latitude: 27.429087,
 *   longitude: 78.116088,
 * });
 * document.querySelector('#preview').src = output;
 */
async function createLocationCard(imageSource, details) {
  const { latitude, longitude } = details;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new TypeError('Provide valid latitude (-90 to 90) and longitude (-180 to 180) values.');
  }

  const location = await reverseGeocode(latitude, longitude);
  const image = await loadImage(imageSource);
  const canvas = document.createElement('canvas');
  canvas.width = 771;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  drawCover(ctx, image, canvas.width, canvas.height, details.zoom || 1, details.offsetX || 0, details.offsetY || 0);
  drawLocationCard(ctx, canvas, { ...details, ...location });
  return canvas.toDataURL('image/png');
}

async function reverseGeocode(latitude, longitude) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.search = new URLSearchParams({
    format: 'jsonv2', lat: latitude, lon: longitude, addressdetails: 1,
    zoom: 18, layer: 'address', 'accept-language': 'en'
  });
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Location lookup failed (${response.status}). Check your internet connection and try again.`);
  const address = (await response.json()).address || {};
  const city = address.city || address.town || address.village || address.municipality || address.county || address.state_district || 'Not available';
  const stateAndPincode = [address.state, address.postcode].filter(Boolean).join(' - ') || 'Not available';
  return {
    plusCode: shortenPlusCode(encodePlusCode(latitude, longitude)),
    city,
    stateAndPincode,
    country: address.country || 'Not available'
  };
}

// Open Location Code encoder. The short form is intended to be shown with the
// reverse-geocoded locality, just like the supplied reference image.
function encodePlusCode(latitude, longitude) {
  const alphabet = '23456789CFGHJMPQRVWX';
  const pairResolutions = [20, 1, 0.05, 0.0025];
  let lat = Math.min(90 - 1e-12, latitude) + 90;
  let lon = ((longitude + 180) % 360 + 360) % 360;
  let code = '';
  for (const resolution of pairResolutions) {
    const latDigit = Math.floor(lat / resolution);
    const lonDigit = Math.floor(lon / resolution);
    code += alphabet[latDigit] + alphabet[lonDigit];
    lat -= latDigit * resolution;
    lon -= lonDigit * resolution;
  }
  // The first grid digit subdivides the remaining 0.0025° pair cell.
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
  return `${code.slice(0, 8)}+${code.slice(8)}`;
}

function shortenPlusCode(fullCode) { return fullCode.slice(4); }

function drawLocationCard(ctx, canvas, details) {
  const { latitude, longitude, plusCode = '', city = '', stateAndPincode = '', country = '' } = details;

  // Pixel measurements sampled from the 771 × 1024 reference card.
  const k = canvas.width / 771;
  const pad = 27 * k;
  const cardHeight = 234 * k;
  const cardY = canvas.height - cardHeight - 26 * k;
  const cardWidth = canvas.width - pad * 2;

  roundRect(ctx, pad, cardY, cardWidth, cardHeight, 18 * k);
  ctx.fillStyle = 'rgba(8, 8, 8, 0.91)';
  ctx.fill();
  ctx.lineWidth = 3 * k;
  ctx.strokeStyle = '#11b9c2';
  ctx.stroke();

  const left = 50 * k;
  const right = 397 * k;
  const code = plusCode || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  text(ctx, `📍  ${code}`, left, cardY + 50 * k, 23 * k, '#fff', '700');
  label(ctx, 'STREET', left, cardY + 87 * k, k);
  text(ctx, plusCode || code, left, cardY + 108 * k, 17 * k, '#fff', '600');
  label(ctx, 'CITY / DISTRICT', left, cardY + 146 * k, k);
  text(ctx, city || 'Not specified', left, cardY + 167 * k, 17 * k, '#fff', '600');

  label(ctx, 'STATE & PINCODE', right, cardY + 87 * k, k);
  text(ctx, stateAndPincode || 'Not specified', right, cardY + 108 * k, 17 * k, '#fff', '600');
  label(ctx, 'COUNTRY', right, cardY + 146 * k, k);
  text(ctx, country || 'Not specified', right, cardY + 167 * k, 17 * k, '#fff', '600');

  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 1 * k;
  ctx.beginPath(); ctx.moveTo(left, cardY + 195 * k); ctx.lineTo(pad + cardWidth - 24 * k, cardY + 195 * k); ctx.stroke();
  text(ctx, `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, left, cardY + 222 * k, 19 * k, '#11dbe7', '700');

}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not load image.'));
    image.src = source;
  });
}

function text(ctx, value, x, y, size, color, weight) {
  ctx.font = `${weight} ${size}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.fillText(value, x, y);
}

function label(ctx, value, x, y, k) { text(ctx, value, x, y, 12 * k, '#bababa', '400'); }

function roundRect(ctx, x, y, w, h, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

// Draw an image so it fills the output, with centre-relative crop offsets in pixels.
function drawCover(ctx, image, width, height, zoom = 1, offsetX = 0, offsetY = 0) {
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const scale = Math.max(width / imageWidth, height / imageHeight) * zoom;
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  // Keep the crop fully covered even if the caller passes a large drag offset.
  const x = Math.max(-((drawWidth - width) / 2), Math.min((drawWidth - width) / 2, offsetX));
  const y = Math.max(-((drawHeight - height) / 2), Math.min((drawHeight - height) / 2, offsetY));
  ctx.drawImage(image, (width - drawWidth) / 2 + x, (height - drawHeight) / 2 + y, drawWidth, drawHeight);
}
