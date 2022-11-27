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
                if (!Object.keys(data).length > 0) {
                    document.getElementById('record').innerHTML = '';
                    setTimeout(() => { alert('No new gatepass request.') }, 200);
                    return;
                }

                window.formContext.record = data;
                document.getElementById('record').innerHTML = `
                     <h4 onclick="window.formContext.SelectEntry()">${data.Seller}</h4>`;
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
        var canvas = document.createElement("canvas");
        canvas.width = 70;
        canvas.height = 40;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(document.getElementById(source), 0, 0);
        const base64String = canvas.toDataURL();

        var requestHeaders = new Headers();
        requestHeaders.append("apikey", "K84477874688957");

        var formdata = new FormData();
        formdata.append("language", "eng");
        formdata.append("isOverlayRequired", "false");
        formdata.append("Base64Image", base64String);
        formdata.append("iscreatesearchablepdf", "false");
        formdata.append("issearchablepdfhidetextlayer", "false");

        var requestOptions = {
            method: 'POST',
            headers: requestHeaders,
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://api.ocr.space/parse/image", requestOptions)
            .then(response => {
                if (!response.ok)
                    throw new Error("Something went wrong while parsing image.");
                return response.json();
            })
            .then(data => {
                if (data['IsErroredOnProcessing'])
                    throw new Error("Invalid image provided.")

                const parsedText = data.ParsedResults[0].ParsedText;
                const identifiedNumber = parsedText.match(/\d/g).join("");
                if (isNaN(identifiedNumber))
                    throw new Error("Parsed image is not a number");

                document.getElementById(target).value = identifiedNumber;
                document.getElementById(target).dispatchEvent(new Event('change'));
            })
            .catch(err => {
                alert(`Captcha parse failed: ${err.message}`);
            })
    }
}