
var util = document.createElement("script");
util.innerHTML = "function popRecord(){ fetch('https://automationfxapp.azurewebsites.net/emandi/pop'); }; function hide(id){ document.getElementById(id).style.display='none' }; function get(id){ return document.getElementById(id); }; function Capitalize(str){  };";
document.getElementsByTagName('body')[0].append(util);

var scripts = {
    'add_six_r': "function selectEntry(id){ get('sname').value = gatepasses[id].Seller; get('quantity').value = gatepasses[id].Weight; }; get('rateofcrop').addEventListener('DOMSubtreeModified', (event) => {get('crop_rate').value = '1000'; get('crop_rate').dispatchEvent(new Event('change'));}); var event = new Event('change'); function mSubmit(){ get('vikreta_details').value = Capitalize(get('sname').value); get('vikreta_mobile').value = '7037433280'; get('ForSelf').checked = true; get('ForSelf').dispatchEvent(event); get('crop_code').value = '58'; get('crop_code').dispatchEvent(event); get('crop_type').value = 'Mota'; get('crop_weight').value = parseFloat(get('quantity').value).toFixed(3); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none'; }",
    'NineR': "",
    'NineRSubmit': "get('cost').addEventListener('change', (event) => {  get('crop_type').value = 'Mota'; get('mandi_rate5').value = '0'; get('mandi_rate5').dispatchEvent(new Event('change')); get('mandi_rate6').value = '0'; get('mandi_rate6').dispatchEvent(new Event('change')); get('mandi_rate7').value = '0'; get('mandi_rate7').dispatchEvent(new Event('change')); get('mandi_rate8').value = '0'; get('mandi_rate8').dispatchEvent(new Event('change'));});  Object.defineProperty(get('cost'), \"value\", { get: function() { return this.getAttribute('value'); }, set: function(val) { if(val && val != this.getAttribute('value')) {this.dispatchEvent(new Event('change'));} this.setAttribute(\"value\", val); }});  document.querySelector('input[type=\"checkbox\"]').checked = true; document.querySelector('input[type=\"checkbox\"]').dispatchEvent(new Event('click')); function mSubmit(){ document.getElementsByClassName('weights')[0].value = document.getElementsByClassName('Currentweights')[0].value; document.getElementsByClassName('weights')[0].dispatchEvent(new Event('change')); get('rate').value = '1000'; get('rate').dispatchEvent(new Event('change')); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none';};",
    'add_gatepass': "get('nine_r_id').value = get('nine_r_id').options[1].value; get('nine_r_id').dispatchEvent(new Event('change')); function mSubmit() { popRecord(); get('dist_ofdestination').value = get('space').value; get('home_center').value = Capitalize(get('destination').value); get('vehicle').value = get('carrier').value; get('vehicle').dispatchEvent(new Event('change')); get('vehicle_no').value = get('carrier-no').value.toUpperCase(); get('bundle_no').value = get('packets').value; get('state').value = 'other'; get('state').dispatchEvent(new Event('change')); get('other_state_mandi').value = Capitalize(get('statename').value); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none'; }",
    'print_9R': "function Print(download){ var tables = []; var content = document.querySelector('body > div.row > #content'); tables.push(content.querySelector('.table').outerHTML); tables.push(content.querySelector('.row .col-md-12 table').outerHTML); var data = { 'name': 'niner', 'tables': tables, 'qr': content.querySelector('#qrcode img').src, 'download': download }; var xhttp = new XMLHttpRequest(); xhttp.onload = function () { if (xhttp.status != 201) { alert(`Error ${xhttp.status}: ${xhttp.response}`); } else { if(download){ window.open('https://automationfxapp.azurewebsites.net/files/'+xhttp.response); } else { alert('Print Job Created!'); }}}; xhttp.open('POST', 'https://automationfxapp.azurewebsites.net/html', true); xhttp.setRequestHeader('Content-Type', 'application/json;'); xhttp.send(JSON.stringify(data)); get('myModal').style.display = 'none';}",
    'print_gatepass': "function Print(download){ var tables = []; var content = document.querySelector('body > div.row > #content'); tables.push(content.querySelector('.table').outerHTML); tables.push(content.querySelector('.row .col-md-12 table').outerHTML); tables.push(content.querySelectorAll('.row .col-md-12 table')[1].outerHTML); tables.push(content.querySelectorAll('.row .col-md-12 .row')[0].outerHTML); var data = { 'name': 'gatepass', 'tables': tables, 'qr': content.querySelector('#qrcode img').src, 'download': download }; var xhttp = new XMLHttpRequest(); xhttp.onload = function () { if (xhttp.status != 201) { alert(`Error ${xhttp.status}: ${xhttp.response}`); } else { if(download){ window.open('https://automationfxapp.azurewebsites.net/files/'+xhttp.response); } else { alert('Print Job Created!'); }}}; xhttp.open('POST', 'https://automationfxapp.azurewebsites.net/html', true); xhttp.setRequestHeader('Content-Type', 'application/json'); xhttp.send(JSON.stringify(data)); get('myModal').style.display = 'none';}",
    'DigitalPayment': "let wait = setInterval(() => { if (document.querySelector('#datatable1 > tbody').childElementCount > 0) { clearInterval(wait); if (document.getElementsByClassName('chk').length > 0) { document.getElementsByClassName('chk')[0].click(); document.getElementById('proceddnow').click(); } else { alert('No Payment Pending') } } }, 1000);",
    'GeneratedDigitalPayment': "document.getElementById('Pay').click();"
}

var script = document.createElement("script");
script.innerHTML = scripts[route];

if (route == gatepass) {
    let extraScript = "function selectEntry(id){ get('destination').value = gatepasses[id].Mandi; get('destination').dispatchEvent(new Event('change')); get('carrier').value = gatepasses[id].Type; get('carrier-no').value = gatepasses[id].VehicleNo; get('packets').value = gatepasses[id].Packets; get('statename').value = gatepasses[id].State; get('space').value = gatepasses[id].Distance; }"
    let extrascriptTag = document.createElement('script');
    extrascriptTag.innerHTML = extraScript;
    document.getElementsByTagName('body')[0].append(extrascriptTag);

    document.getElementById('PaidType').value = document.getElementById('PaidType').options[1].value;
    document.getElementById('PaidType').dispatchEvent(new Event('change'));
    let wait = setInterval(() => {
        if (document.getElementById('nine_r_id').options.length > 1) {
            document.getElementsByTagName('body')[0].append(script);
            document.getElementById('gpsubmit').removeAttribute('disabled');
            clearInterval(wait);
        }
    }, 1000);
}
else
    document.getElementsByTagName('body')[0].append(script);

if ([selectPayment, doPayment].includes(route))
    throw new Error('Script Loaded headless...');

var modals = {
    'add_six_r': '<div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><div id="entries"></div><hr class="hr"><input type="text" id="sname" placeholder="Seller Name" /><hr><input type="text" id="quantity" placeholder="Quantity (In Quintals)" /><hr><div id="img-captcha"></div><hr><input type="text" placeholder="Captcha Code" id="in-captcha"/><hr><button onclick="mSubmit()">Submit</button></div></div>',
    'NineR': '<div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><div id="entries"></div><hr class="hr"><input type="text" id="bname" placeholder="Buyer Name" /><hr><button onclick="mSubmit()">Submit</button></div></div>',
    'NineRSubmit': '<div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><div id="img-captcha"></div><hr><input type="text" placeholder="Captcha Code" id="in-captcha"/><hr><button onclick="mSubmit()">Submit</button></div></div>',
    'add_gatepass': '<style>input[type=text]{width: 100%;}</style><div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><div id="entries"></div><hr class="hr"><input type="text" id="destination" placeholder="Destined Market" /><hr><select id="carrier" placeholder="Select Vehicle" style="width: 100%; height:27px;"><option value="1">Truck</option><option value="2">Pick-Up</option><option value="4">DCM</option></select><hr><input type="text" id="carrier-no" placeholder="Vehicle Number" /><hr><input type="text" id="packets" placeholder="Packets" /><hr><input type="text" id="statename" placeholder="State" /><hr><div id="img-captcha"></div><hr><input type="text" placeholder="Captcha Code" id="in-captcha"/><hr><input type="text" placeholder="Distance" id="space" /><hr><button id="gpsubmit" disabled onclick="mSubmit()">Submit</button><hr></div></div>',
    'print_9R': '<div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><hr><div style="display: flex;" id="msgholder"><input type="checkbox" id="download">&nbsp;Only download the document.</div><hr><button onclick="Print(document.getElementById(\'download\').checked)">Print Document</button></div></div>',
    'print_gatepass': '<div id="myModal"><div class="head"><div style="color: #e7e9eb">Provide The Information</div><button onclick="hide(\'myModal\')">x</button></div><div id="zContent"><hr><div id="msgholder" style="display: flex;"><input type="checkbox" id="download">&nbsp;Only download the document.</div><hr><button onclick="Print(document.getElementById(\'download\').checked)">Print Document</button></div></div>'
}

if (route.includes('print')) {
    document.getElementById('content').append(modal);
}
else {
    document.getElementById('ui').append(modal);
    if (route != niner)
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
}

if (![sixr, niner, gatepass].includes(route))
    throw new Error('Loading content not required...');

const url = 'https://automationfxapp.azurewebsites.net/emandi/peek';
fetch(url)
    .then(response => response.json())
    .then(data => {
        if (!Object.keys(data).length > 0) {
            alert('No new gatepass request.');
            return;
        }

        let gatepasses = [data];
        const vars = document.createElement("script");
        vars.innerHTML = `var gatepasses = ${JSON.stringify(gatepasses)}`;
        document.getElementsByTagName('body')[0].append(vars);

        let elements = [];
        gatepasses.forEach((entry, index) => {
            const div = document.createElement("div");
            div.innerHTML = `<input type='radio' id='${index}' style='display: none;' onclick='selectEntry(this.id)'></td><td><label style="white-space: nowrap; font-weight: 400;" for='${index}'>${entry.Seller}</label>`
            elements.push(div);
        })
        elements.forEach((element) => {
            document.getElementById('entries').appendChild(element);
        })
        document.getElementsByClassName('hr')[0].style.display = 'block';
    })