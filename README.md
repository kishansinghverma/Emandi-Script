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
- Navigate to JSDelivr and Purge the old cache :
    ```
    https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/dist/emandi.js
    https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@main/other/ScriptInjection.js
    ```
- Copy and paste the content of `ScriptInjection.js` in TamperMonkey / Stay.
- Make sure JsDelivr server is uncommented.