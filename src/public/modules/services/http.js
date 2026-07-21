import { HttpMessages } from "../constants.js";

/**
 * Unified HTTP request wrapper.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @returns {Promise<any>} The parsed JSON or text response.
 */
export const httpRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const defaultMessage = HttpMessages[response.status] || "An error occurred while fetching data.";
            let errorMessage = defaultMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || defaultMessage;
            } catch (e) {
                // If it's not JSON, maybe text
                try {
                    const errorText = await response.text();
                    if (errorText) errorMessage = errorText;
                } catch (e2) {}
            }
            throw new Error(`HTTP Error ${response.status}: ${errorMessage}`);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return await response.text();
        }

    } catch (error) {
        console.error("HTTP Request Error:", error);
        throw error;
    }
};
