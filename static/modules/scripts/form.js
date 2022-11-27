
export class Form {
    FetchRecord() {
        const url = 'https://automationfxapp.azurewebsites.net/emandi/peek';
        fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error(response.statusText);
                return response.json()
            })
            .then(data => {
                window.formContext.record = data;
                if (Object.keys(data).length > 1)
                    document.getElementById('record').innerHTML = `
                     <h4 onclick="window.formContext.SelectEntry()">${data.Seller}</h4>`;
                else
                    document.getElementById('record').innerHTML = '';
            })
            .catch(err => {
                document.getElementById('record').innerHTML = '';
                setTimeout(() => { alert(err.message) }, 200);
            })
    }

    HideModal() {
        document.getElementById('customModal').style.display = 'none';
    }

    Capitalize(str) {
        var result = '';
        const tokens = str.trim().split(' ');
        for (const token of tokens) {
            result += token[0].toUpperCase() + token.slice(1) + ' ';
        }
        return result.trim();
    }

    AllowUpdate(str) {
        if (str.length == 4)
            document.getElementById('updateBtn').removeAttribute('disabled');
        else
            document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }

    ParseCaptcha(source, target) {
        var visionScript = document.createElement('script');
        visionScript.src = 'https://unpkg.com/tesseract.js@4.0.0/dist/tesseract.min.js';

        visionScript.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = 70;
            canvas.height = 40;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(document.getElementById(source), 0, 0);
            const base64String = canvas.toDataURL();
            const image = document.createElement('img');
            image.src = base64String;

            Tesseract.recognize(image, 'eng', {})
                .then(({ data: { text } }) => {
                    if (isNaN(text))
                        throw new Error('Captcha Not Parsed!');

                    document.getElementById(target).value = text;
                    document.getElementById(target).dispatchEvent(new Event('change'));
                })
                .catch(err => { alert(err.message) });
        };

        document.getElementsByTagName('body')[0].appendChild(visionScript);
    }
}