import { HttpMessages } from "../constants.js";

const parseResponse = async (response) => {
    if (response.status === 204) return undefined;

    const text = await response.text();
    if (!text) throw new Error("Empty response received from the server.");

    try {
        const json = JSON.parse(text);
        if (json.content !== undefined) return json.content;
    }
    catch {
        return text;
    }

    throw new Error("Invalid JSON response received from the server.")
};

export const validateResponse = async (response) => {
    if (response.ok) return response;

    const json = await response.json().catch(() => undefined);
    const errorMessage = json?.message ?? HttpMessages[response.status];
    throw new Error(json?.isError ? errorMessage : HttpMessages[response.status]);
}

export const sendRequest = async (url, options = {}) => {
    const response = await fetch(url, { ...options }).then(validateResponse);
    const payload = await parseResponse(response);
    return payload;
};
