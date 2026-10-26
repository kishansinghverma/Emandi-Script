import { FetchParams } from "../constants.js";
import { validateResponse } from "./backend.js";

const toEmandiDate = (date = new Date()) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}/${date.getFullYear()}`;
};

const getShiftedDate = (baseDate, daysAgo) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - daysAgo);
    return date;
};

const findEntry = async (url, fromDate, toDate, serialNumber = "") => {
    const body = new URLSearchParams({
        fromDate,
        toDate,
        draw: "1",
        start: "0",
        length: "1",
        "search[value]": serialNumber,
        "order[0][column]": "1",
        "order[0][dir]": "desc"
    });

    const response = await fetch(url, { ...FetchParams.PostUrlEncoded, body: body.toString() }).then(validateResponse);
    if (response.redirected || response.url.includes("/Account/")) {
        throw new Error("E-Mandi session expired. Please log in again.");
    }

    const { data } = await response.json();
    return Array.isArray(data) && data[0] ? data[0] : null;
};

const getEntry = async (...args) => {
    const entry = await findEntry(...args);
    if (!entry) throw new Error("E-Mandi Record Not Found.");
    return entry;
};

const getEntryBySerialNumber = (url, serialNumber, date) => {
    const normalizedSerialNumber = typeof serialNumber === "string" ? serialNumber.trim() : "";
    if (!normalizedSerialNumber) throw new Error("Record Serial Number Is Required.");

    if (date === undefined) {
        const toDate = new Date();
        const fromDate = new Date(toDate);
        fromDate.setFullYear(fromDate.getFullYear(), fromDate.getMonth() - 18);
        return getEntry(url, toEmandiDate(fromDate), toEmandiDate(toDate), normalizedSerialNumber);
    }

    const isoDate = typeof date === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date) : null;
    const normalizedDate = date instanceof Date ? toEmandiDate(date) : (isoDate ? `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}` : (typeof date === "string" ? date : toEmandiDate()));
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(normalizedDate || "");
    if (!match) throw new Error("Date must use DD/MM/YYYY format.");

    return getEntry(url, normalizedDate, normalizedDate, normalizedSerialNumber);
};

const getLatestEntry = async (url, maxDaysBack = 7) => {
    const today = new Date();
    const todayStr = toEmandiDate(today);
    let entry = await findEntry(url, todayStr, todayStr);
    if (entry) return entry;

    for (let daysAgo = 1; daysAgo <= maxDaysBack; daysAgo++) {
        const dateStr = toEmandiDate(getShiftedDate(today, daysAgo));
        entry = await findEntry(url, dateStr, dateStr);
        if (entry) return entry;
    }

    throw new Error("E-Mandi Record Not Found.");
};

export const getSixrBySerialNumber = (serialNumber) => getEntryBySerialNumber("/Traders/SP_Get_6R_List", serialNumber);

export const getNinerBySerialNumber = (serialNumber, date) => getEntryBySerialNumber("/Traders/SP_Get_9R_List", serialNumber, date);

export const getGatepassBySerialNumber = (serialNumber, date) => getEntryBySerialNumber("/Traders/SP_Get_Gatepass_List", serialNumber, date);

export const getLatestNiner = () => getLatestEntry("/Traders/SP_Get_9R_List");

export const getLatestGatepass = () => getLatestEntry("/Traders/SP_Get_Gatepass_List");
