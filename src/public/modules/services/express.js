import { FetchRecordToProcess } from "./provider.js";
import { ComplexPromise } from "./utils.js";


class ExpressConfiguration {
    constructor() {
        this.Promise = new ComplexPromise();
    }

    InitConfiguration = async () => {
        this.RemoveConfiguration();
        const record = await FetchRecordToProcess();
        if (record) localStorage.setItem('Configuration', JSON.stringify({ Record: record }));
    }

    GetConfiguration = async () => {
        if (!localStorage.getItem('Configuration')) await this.InitConfiguration();
        const localData = localStorage.getItem('Configuration');
        if (localData) return JSON.parse(localData);
    }

    RemoveConfiguration = () => localStorage.removeItem('Configuration');

    DisplayRecord = async () => {
        const configuration = await this.GetConfiguration();
        this.Promise.Resolve();

        const container = $('div.navbar-collapse.nav-responsive-disabled > ul:nth-child(1) > li:nth-child(1)');
        container.parent().find('li').slice(1).remove();
        container.after($('<li><a onclick="window.commonContext.RefreshRecord()"><i class="fa fa-refresh" aria-hidden="true"></i></a></li>'));

        const contents = configuration ?
            $(`<li><a onclick="window.commonContext.StartExpress()"><b>Queued : </b>${configuration.Record.Party}</a></li>`) :
            $(`<li><a href="#"><b>No Queued Request!</b></a></li>`);
        container.after(contents);
    }

    StartExpress = async () => {
        const configuration = await this.GetConfiguration();
        localStorage.setItem('Configuration', JSON.stringify({ ...configuration, IsExpress: true }));
        window.location.href = '/Traders/add_six_r';
    };

    ExecuteViaExpress = async (callback) => {
        const configuration = await this.GetConfiguration();
        if (configuration?.IsExpress) callback();
    }
}

export const ExpressConfig = new ExpressConfiguration();

export const SetPrintConfig = (target, ninerId, gatepassId) => localStorage.setItem('ExpressPrint', JSON.stringify({ IsExpress: true, Target: target, GP: gatepassId, NinerR: ninerId }));

export const RemovePrintConfig = async () => localStorage.removeItem('ExpressPrint');

export const GetPrintConfig = () => {
    const config = JSON.parse(localStorage.getItem('ExpressPrint'));
    return config?.IsExpress ? config : { IsExpress: false };
}