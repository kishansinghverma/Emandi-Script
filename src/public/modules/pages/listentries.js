// import { MessageType } from "../constants.js";
// import { showAlert } from "../services/utils.js";

class ListEntries {
    InitializeForm = () => {
        if (localStorage.getItem('ExpressPrint') === "true"){
            showAlert(MessageType.Info, 'Running In Express Mode...', 3);
            $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostLoad(ajaxOptions.url, jqXHR));
        }

        document.getElementById('filter').click();
    }

    PostLoad(url, data) {
        if (url === '/Traders/SP_Get_9R_List') {
            const id = data?.responseJSON?.data[0]?.id;
            id ? this.RedirectPage(`/Receipt/print_9rs/${id}`) : showAlert(MessageType.Error, 'Unable To Fetch Record!');
        }

        if(url === '/Traders/SP_Get_Gatepass_List') {
            const id = data?.responseJSON?.data[0]?.id;
            id ? this.RedirectPage(`/Receipt/print_gps/${id}`) : showAlert(MessageType.Error, 'Unable To Fetch Record!');
        }
    }

    RedirectPage(url) {
        window.location.href = url;
    }
}

export const List_Entries = new ListEntries();