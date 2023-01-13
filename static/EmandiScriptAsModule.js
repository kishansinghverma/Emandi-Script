var script = document.createElement('script');
script.setAttribute('type', 'module');
script.innerHTML = "import { RunScript } from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@4d1aeba/static/Emandi.js'; window.onload = RunScript();";
document.getElementsByTagName('body')[0].appendChild(script);