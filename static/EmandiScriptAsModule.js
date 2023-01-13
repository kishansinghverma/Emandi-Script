var script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('defer', '');
script.innerHTML = "import { RunScript } from 'https://cdn.jsdelivr.net/gh/kishansinghverma/Emandi-Script@45a9e6d/static/Emandi.js'; window.onload = ()=> { RunScript(); }";
document.getElementsByTagName('body')[0].appendChild(script);