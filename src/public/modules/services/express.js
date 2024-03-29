import { MessageType, StageMap, Stages, Status } from "../constants.js";
import { ComplexPromise, ShowAlert } from "./utils.js";


class ExpressConfiguration {
    constructor() {
        this.Promise = new ComplexPromise();
    }

    SetConfiguration = (config) => localStorage.setItem('Express', JSON.stringify(config));

    RemoveConfiguration = () => localStorage.removeItem('Express');

    InitConfiguration = () => this.SetConfiguration({
        Record: window.queuedRecord,
        Stage: window.isPrepaid ? Stages.NineR : Stages.SixR,
        Status: Status.Init
    });

    GetConfiguration = () => {
        const localData = localStorage.getItem('Express');
        if (localData) return JSON.parse(localData);
    }

    DispatchActionByStage = () => {
        const configuration = this.GetConfiguration();
        if (configuration) {
            const applicableUrl = StageMap[configuration.Stage].Url;
            if (StageMap[configuration.Stage].Redirect)
                if (!window.location.href.includes(applicableUrl))
                    window.location.href = applicableUrl;
        }
    }

    StartExpress = () => {
        this.InitConfiguration();
        this.DispatchActionByStage(true);
    };

    ExecuteViaExpress = (callback) => {
        const configuration = this.GetConfiguration();
        if (configuration?.Status === Status.Init) {
            ShowAlert(MessageType.Info, 'Running In Express Mode...', 3);
            callback();
        }
    }
}

export const ExpressConfig = new ExpressConfiguration();