import { Form } from "./form.js";

class AddGatepass extends Form {
    InitializeForm() {
        this.AttachListener();
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
        this.FetchRecord();
        this.record = window.formContext.record;
    }

    SelectEntry() {
        document.getElementById('destination').value = this.record.Mandi;
        document.getElementById('destination').dispatchEvent(new Event('change'));
        document.getElementById('carrier').value = this.record.Type;
        document.getElementById('carrier-no').value = this.record.VehicleNo;
        document.getElementById('packets').value = this.record.Packets;
        document.getElementById('statename').value = this.record.State;
        document.getElementById('space').value = this.record.Distance;
    };

    AttachListener() {
        document.getElementById('submit').setAttribute("onclick", "window.formContext.PreviewForm()");
        document.getElementById('PaidType').value = document.getElementById('PaidType').options[1].value;
        document.getElementById('PaidType').dispatchEvent(new Event('change'));
        let wait = setInterval(() => {
            if (document.getElementById('nine_r_id').options.length > 1) {
                document.getElementById('nine_r_id').value = document.getElementById('nine_r_id').options[1].value;
                document.getElementById('nine_r_id').dispatchEvent(new Event('change'));
                document.getElementById('updateBtn').removeAttribute('disabled');
                clearInterval(wait);
            }
        }, 1000);
    }

    UpdateForm() {
        document.getElementById('dist_ofdestination').value = document.getElementById('space').value;
        document.getElementById('home_center').value = this.Capitalize(document.getElementById('destination').value);
        document.getElementById('vehicle').value = document.getElementById('carrier').value;
        document.getElementById('vehicle').dispatchEvent(new Event('change'));
        document.getElementById('vehicle_no').value = document.getElementById('carrier-no').value.toUpperCase();
        document.getElementById('bundle_no').value = document.getElementById('packets').value;
        document.getElementById('state').value = 'other';
        document.getElementById('state').dispatchEvent(new Event('change'));
        document.getElementById('other_state_mandi').value = this.Capitalize(document.getElementById('statename').value);
        document.getElementById('DNTCaptchaInputText').value = document.getElementById('in-captcha').value;
        document.getElementById('previewBtn').removeAttribute('disabled');
    }

    PreviewForm() {
        preview_data();
        
        fetch('https://automationfxapp.azurewebsites.net/emandi/update', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                GatepassId: document.getElementById('transaction_number').value
            })
        })
        .finally(()=>{
            fetch('https://automationfxapp.azurewebsites.net/emandi/pop');
        })
    }
}

export const Add_Gatepass = new AddGatepass();

// function mSubmit() {
//     popRecord();
//     get('myModal').style.display = 'none';
// }