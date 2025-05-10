# ABOUT
This project provides the assets (JS, JSON and Static Assets) via the RawGithub or [JsDelivr](https://www.jsdelivr.com/github).

## Development
- Start the local server with `npm start`.
- Copy the content of `ScriptInjection.js` in TamperMonkey / Stay.
- Make sure localhost server is uncommented.
- Save and start development.

## Deployment
- Make all the required changes.
- You can create a production build with `npm run build` manually or github actions do it on every push.
- Do latest commit -> Push.
- Wait for Cache to be purge by Github Actions Or Manually purge them by Navigating to JSDelivr :
    ```
    https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/scriptloader.js
    https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/index.js
    https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/assets/style.css
    ```
- Copy and paste the content of `scriptloader.js` in TamperMonkey / UserScript.
- Make sure JsDelivr server is uncommented.