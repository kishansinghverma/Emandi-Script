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
                    setTimeout(()=>{alert('No new gatepass request.')}, 200);
                    return;
                }

                window.formContext.record = data;
                document.getElementById('record').innerHTML = `
                     <h4 onclick="window.formContext.SelectEntry()">${data.Seller}</h4>`;
            })
            .catch(err => {
                document.getElementById('record').innerHTML = '';
                setTimeout(()=>{alert(err.message)}, 200);
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
}