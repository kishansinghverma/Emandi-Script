import * as Loader from "../assets/loader.js";
import { Add_Gatepass } from "./pages/add_gatepass.js";
import { Add_Six_R } from "./pages/add_six_r.js";
import { Digital_Payment, Success, Generated_Digital_Payment } from "./pages/payment.js";
import { List_Entries } from "./pages/listentries.js";
import { Login } from "./pages/login.js";
import { NineR } from "./pages/niner.js";
import { NineRSubmit } from "./pages/ninersubmit.js";
import { PrintNinerR } from "./pages/print9r.js";
import { PrintGatePass } from "./pages/printgatepass.js";

const CommonDiv = '#content > div > div';
const PrintDiv = '#content';
const LoginDiv = '.box-login';

const baseUrl = "https://nextcloud.azure-api.net/emandi/api";
//const baseUrl = "http://localhost:8585/api";
const homeUrl = "https://nextcloud.azure-api.net/api";

const getUrl = (path) => (`${baseUrl}/${path}`);

export const RouteMap = {
    add_six_r: { Script: Add_Six_R, Div: CommonDiv },
    NineR: { Script: NineR, Div: CommonDiv },
    NineRSubmit: { Script: NineRSubmit, Div: CommonDiv },
    add_gatepass: { Script: Add_Gatepass, Div: CommonDiv },
    print_9R: { Script: PrintNinerR, Div: PrintDiv },
    print_gatepass: { Script: PrintGatePass, Div: PrintDiv },
    DigitalPayment: { Script: Digital_Payment, Div: CommonDiv },
    GeneratedDigitalPayment: { Script: Generated_Digital_Payment, Div: CommonDiv },
    generated_9R: { Script: List_Entries, Div: CommonDiv },
    DigitalPaymentList: { Script: List_Entries, Div: CommonDiv },
    generated_gatepass: { Script: List_Entries, Div: CommonDiv },
    index: { Script: Login, Div: LoginDiv },
    Account: { Script: Login, Div: LoginDiv },
    Success: { Script: Success, Div: CommonDiv }
}

export const FetchParams = {
    Post: {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    }
}

export const Url = {
    UpdateRecord: getUrl('update'),
    SetRate: getUrl('rate'),
    PeekRecord: getUrl('peek'),
    PopRecord: getUrl('pop'),
    PrintPdf: `${homeUrl}/files/html`,
    LogTransaction: `${homeUrl}/transaction/gatepass`,
    SplitwiseExpense: `${homeUrl}/splitwise/transactions`
}

export const HttpMessages = {
    400: "Unable to fetch data, Bad Request!",
    404: "Unable to fetch data from requested resource!",
    204: "No content is available!",
    500: "Something went wrong on server!",
    413: "Content too large to send to server!"
}

export const Icon = {
    success: Loader.Success,
    error: Loader.Error,
    info: Loader.Info
}

export const MessageType = {
    Success: 'success',
    Error: 'error',
    Info: 'info'
}

export const StageMap = {
    SixR: {
        Url: '/Traders/add_six_r',
        Redirect: true
    },
    Payment: {
        Url: '/Traders/DigitalPayment',
        Redirect: false
    },
    NineR: {
        Url: '/Traders/NineR',
        Redirect: true
    },
    Gatepass: {
        Url: '/Traders/add_gatepass',
        Redirect: true
    }
}

export const Stages = {
    SixR: 'SixR',
    Payment: 'Payment',
    NineR: 'NineR',
    Gatepass: 'Gatepass'
}

export const Status = {
    Init: 'Init',
    InProgress: 'InProgress',
    None: 'None',
    Queued: 'Queued'
}

export const Events = {
    RecordLoaded: 'RecordLoaded'
}

export const SplitwiseGroupId = {
    "Prepaid Gatepass": 52740365 
}

export const ItemsToHide = [
    '[href="/MultiCommodity/Index"]',
    '[href="/Traders/Niner2Dashboard"]',
    '[href="/MultiCommodity/add_gatepass"]',
    '[href="/Exemption/ExemptionDashboard"]',
    '[href="/Stock/AvailableStock"]',
    '[href="/Stock/Stocks"]',
    '[href="/Traders/TraderAutogeneratedgatepas"]'
];