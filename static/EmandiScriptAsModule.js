var script = document.createElement('script');
script.setAttribute('type', 'module');
script.innerHTML = "import { RunScript } from 'http://localhost:3001/static/Emandi.js'; window.onload = RunScript();";
document.getElementsByTagName('body')[0].appendChild(script);