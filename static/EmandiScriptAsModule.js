var script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('defer', '');
script.innerHTML = "import { RunScript } from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@0a5ea57/static/Emandi.js'; RunScript();";
document.getElementsByTagName('body')[0].appendChild(script);