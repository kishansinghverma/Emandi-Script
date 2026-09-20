export const Success = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
`;

export const Error = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="m8.8 8.8 6.4 6.4m0-6.4-6.4 6.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
`;

export const Info = `
<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/><path d="M12 10.5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="7.5" r=".8" fill="currentColor"/></svg>
`;

export const CaptchaLoader = `
<div class="captcha-input-loader" title="Resolving Captcha...">
    <svg viewBox="0 0 50 50" class="captcha-spinner-svg">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
</div>
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
