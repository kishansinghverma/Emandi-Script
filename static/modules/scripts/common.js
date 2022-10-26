export class Form {
    FetchRecord() {
        const url = 'https://automationfxapp.azurewebsites.net/emandi/peek';
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!Object.keys(data).length > 0) {
                    alert('No new gatepass request.');
                    return;
                }

                window.formContext.record = data;
                document.getElementById('record').innerHTML = `
                     <h4 onclick="window.formContext.SelectEntry()">${data.Seller}</h4>`;
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