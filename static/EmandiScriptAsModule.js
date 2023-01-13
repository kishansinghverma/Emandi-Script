var script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('defer', '');
script.innerHTML = "import { RunScript } from 'http://localhost:3001/static/Emandi.js'; RunScript();";
document.getElementsByTagName('body')[0].appendChild(script);