import { Events, StageMap, Status } from "../constants.js";
import { ExpressConfig } from "./express.js";
import { AlertError } from "./utils.js";

export class Form {
    constructor() {
        this.Configuration = ExpressConfig.GetConfiguration();
    }

    DisplayRecord(record) {
        record ?
            $('#record')?.html(`<h4 onclick="window.formContext.SelectEntry()">${record.Seller}</h4>`) :
            $('#record')?.html('');
    }

    FetchRecord() {
        if (this.Configuration) {
            this.Record = this.Configuration.Record;
            this.DisplayRecord(this.Record);
        }
        else {
            document.body.addEventListener(Events.RecordLoaded, () => {
                this.Record = window.queuedRecord;
                this.DisplayRecord(this.Record);
            })
        }
    }

    SetInProgress() {
        if (this.Configuration?.Status === Status.Init)
            ExpressConfig.SetConfiguration({ ...this.Configuration, Status: Status.InProgress });
    }

    AllowUpdate(str) {
        if (str.length == 4) document.getElementById('updateBtn').removeAttribute('disabled');
        else document.getElementById('updateBtn').setAttribute('disabled', 'disabled');
    }
}