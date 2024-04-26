export const Success = `
<?xml version="1.0" encoding="utf-8"?>
<svg fill="#28a745" width="24px" height="24px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M0 7a7 7 0 1 1 14 0A7 7 0 0 1 0 7z M6.278 7.697L5.045 6.464a.296.296 0 0 0-.42-.002l-.613.614a.298.298 0 0 0 .002.42l1.91 1.909a.5.5 0 0 0 .703.005l.265-.265L9.997 6.04a.291.291 0 0 0-.009-.408l-.614-.614a.29.29 0 0 0-.408-.009L6.278 7.697z" fill-rule="evenodd"/></svg>
`;

export const Error = `
<?xml version="1.0" encoding="utf-8"?>
<svg fill="#dc3545" width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.91 3.23 3.23 7.913v-.01a.81.81 0 0 0-.23.57v7.054c0 .22.08.42.23.57L7.9 20.77c.15.15.36.23.57.23h7.06c.22 0 .42-.08.57-.23l4.67-4.673a.81.81 0 0 0 .23-.57V8.473c0-.22-.08-.42-.23-.57L16.1 3.23a.81.81 0 0 0-.57-.23H8.48c-.22 0-.42.08-.57.23ZM12 7a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm-1 9a1 1 0 0 1 1-1h.008a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1Z" fill="#dc3545"/></svg>
`;

export const Info = `
<?xml version="1.0" encoding="utf-8"?>
<svg width="24px" height="24px" viewBox="0 0 48 48" version="1" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48">
    <circle fill="#2196F3" cx="24" cy="24" r="21"/>
    <rect x="22" y="22" fill="#ffffff" width="4" height="11"/>
    <circle fill="#ffffff" cx="24" cy="16.5" r="2.5"/>
</svg>
`;

export const Loader = `
<div class="spinner-container">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin: auto; background: rgba(241, 242, 243, 0); display: block;" width="150px" height="150px"
      viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="translate(50,50)">
        <circle cx="0" cy="0" r="8.333333333333334" fill="none" stroke="#007993" stroke-width="4.5"
          stroke-dasharray="26.179938779914945 26.179938779914945">
          <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s"
            calcMode="spline" keySplines="0.2 0 0.8 1" begin="0" repeatCount="indefinite"></animateTransform>
        </circle>
        <circle cx="0" cy="0" r="16.666666666666668" fill="none" stroke="#00cccc" stroke-width="4.5"
          stroke-dasharray="52.35987755982989 52.35987755982989">
          <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s"
            calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.2" repeatCount="indefinite"></animateTransform>
        </circle>
        <circle cx="0" cy="0" r="25" fill="none" stroke="#00f0ce" stroke-width="4.5"
          stroke-dasharray="78.53981633974483 78.53981633974483">
          <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s"
            calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.4" repeatCount="indefinite"></animateTransform>
        </circle>
        <circle cx="0" cy="0" r="33.333333333333336" fill="none" stroke="#12f8a9" stroke-width="4.5"
          stroke-dasharray="104.71975511965978 104.71975511965978">
          <animateTransform attributeName="transform" type="rotate" values="0 0 0;360 0 0" times="0;1" dur="1s"
            calcMode="spline" keySplines="0.2 0 0.8 1" begin="-0.6" repeatCount="indefinite"></animateTransform>
        </circle>
      </g>
    </svg>
    <div class="spinner-message"></div>
  </div>
</div>
`;