var script = document.createElement('script');
script.innerHTML = `import {RunScript} from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@675b85d/static/Emandi.js';
RunScript();`;
script.setAttribute('type', 'module');
document.getElementsByTagName('body')[0].appendChild(script);