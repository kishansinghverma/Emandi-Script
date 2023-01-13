var script = document.createElement('script');
script.setAttribute('type', 'module');
script.innerHTML = `import { RunScript } from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@675b85d/static/Emandi.js'; RunScript();`;
document.getElementsByTagName('body')[0].appendChild(script);