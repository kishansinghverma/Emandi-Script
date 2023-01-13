# ABOUT
This project provides the assets (JS, JSON and Static Assets) via the RawGithub or [JsDelivr](https://www.jsdelivr.com/github).

## Development
- Start the local server with `npm start`.
- Update the scripts location in Scripty to `http://localhost:3001/static/Emandi.js`.
- Save and start development.

## Deployment
- Make all the required changes -> commit -> push.
- Navigate to Github and get the latest commit number.
- Open `EmandiScriptAsModule.js` and update the old commit number with the latest one in script's location Url.
- Again save -> commit -> push.
- For Mobile: Use the `https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@<lastest commit #>/static/EmandiScriptAsModule.js`.
- For PC: Copy and paste the content of `EmandiScriptAsModule.js` in Scripty.