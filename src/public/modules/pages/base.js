import { captchaHandler } from "../services/captcha.js";

export class BaseController {
    constructor() {
        if (this.constructor === BaseController) {
            throw new Error("Cannot instantiate abstract class BaseController");
        }
        this.captcha = captchaHandler;
    }

    /**
     * Initializes the form by executing initial actions and binding events.
     */
    async initializeForm() {
        await this.executeInitialActions();
        this.attachListener();
    }

    /**
     * Abstract method. Attach events to DOM elements and global listeners.
     */
    attachListener() {
        throw new Error("Method 'attachListener' must be implemented");
    }

    /**
     * Abstract method. Execute initial actions on page load (like resolving captcha, rendering records).
     */
    async executeInitialActions() {
        throw new Error("Method 'executeInitialActions' must be implemented");
    }

    /**
     * Abstract method. Synchronizes data to the form before submission.
     */
    updateForm() {
        throw new Error("Method 'updateForm' must be implemented");
    }

    /**
     * Abstract method. Validates and submits the form data.
     */
    submitForm() {
        throw new Error("Method 'submitForm' must be implemented");
    }

    /**
     * Optional method to handle AJAX responses. Can be overridden.
     */
    handleAjaxResponse(ajaxOptions, response) {
        // Base implementation does nothing
    }
}
