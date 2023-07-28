import { ExpressConfig, SetPrintConfig } from "./express.js";
import { FetchLastRecordId } from "./provider.js";

export const PrintLastRecords = async (target) => {
    const ninerId = await FetchLastRecordId('/Traders/SP_Get_9R_List');
    const gatepassId = await FetchLastRecordId('/Traders/SP_Get_Gatepass_List');
    SetPrintConfig(target, ninerId, gatepassId);

    window.open(`/Receipt/print_9rs/${ninerId}`, '_blank');
}

export const StartExpress = ExpressConfig.StartExpress;