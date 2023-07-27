import { ExpressConfig } from "./express.js";

export class Form {
    constructor() {
        this.ExpressConfiguration = ExpressConfig;
    }

    ShowRecord() {
        this.ExpressConfiguration.Promise.Operator.then(async () => {
            const configuration = await this.ExpressConfiguration.GetConfiguration();
            this.Record = configuration?.Record;
            this.Record ? $('#record')?.html(`<h4 onclick="window.formContext.SelectEntry()">${this.Record.Seller}</h4>`) : $('#record')?.html('');
        })
    }

    HideModal() {
        $('#customModal').hide();
    }

    AllowUpdate(str) {
        if (str.length == 4) document.getElementById('updateBtn').removeAttribute('disabled');
        else document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }
}