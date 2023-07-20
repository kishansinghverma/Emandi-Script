import { Success, Error, Info } from "../assets/loader.js";

const baseUrl = "https://nextcloud.azure-api.net/emandi/api";
//const baseUrl = "http://localhost:8585/api";
const homeUrl = "https://nextcloud.azure-api.net/api"

const getUrl = (path) => (`${baseUrl}/${path}`);

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
    LogTransaction: `${homeUrl}/transaction/gatepass`
}

export const HttpMessages = {
    400: "Unable to fetch data, Bad Request!",
    404: "Unable to fetch data from requested resource!",
    204: "No content is available!",
    500: "Something went wrong on server!",
    413: "Content too large to send to server!"
}

export const Icon = {
    success: Success,
    error: Error,
    info: Info
}

export const MessageType = {
    Success: 'success',
    Error: 'error',
    Info: 'info'
}