import { HttpMessages, Icon, MessageType, Status } from "../constants.js";

export class ComplexPromise {
    constructor() {
        this.Operator = new Promise((resolve, reject) => {
            this.Resolve = resolve;
            this.Reject = reject;
        })
    }
};

export const AlertError = (err) => err.message ? ShowAlert(MessageType.Error, err.message, 3) : ShowAlert(MessageType.Error, err, 3);

export const LogError = (err) => console.log(err.message);

export const ShowLoader = () => $('#loader').show();

export const HideLoader = () => $('#loader').hide();

export const HandleResponse = (response) => {
    if (!response.ok || response.status === 204)
        throw { message: HttpMessages[response.status], code: response.status }
}
export const HandleJsonResponse = (response) => {
    HandleResponse(response);
    return response.json();
}

export const HandleByStatusCode = (response) => {
    HandleResponse(response);
    return response;
}

export const Capitalize = (str) => {
    const result = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return result.trim();
}

export const Download = async (response) => {
    const fileName = response.url.split('/').pop();
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

export const ShowAlert = (type, message, hideAfter = 0) => {
    $('#notification-container').removeClass().addClass(type).show();
    $('#icon').html(Icon[type]);
    $('#message').html(message);
    if (hideAfter > 0) setTimeout(() => $('#notification-container').fadeOut(200), hideAfter * 1000);
}

export const SetRecordStatus = (status, data) => {
    const container = $('div.navbar-collapse.nav-responsive-disabled > ul:nth-child(1) > li:nth-child(1)');
    container.parent().find('li').slice(1).remove();

    switch (status) {
        case Status.InProgress:
            container.after($(`<li><a href="#"><b>In Progress : </b>${data?.Party}</a></li>`));
            break;
        
        case Status.Queued:
            window.queuedRecord = data;
            container.after($(`<li><a href="#" onclick="window.commonContext.StartExpress()"><b>Queued : </b>${data?.Party}</a></li>`));
            break;
    
        case Status.None:
            container.after($(`<li><a href="#"><b>No Queued Request</b></a></li>`));
            break;
    }
}