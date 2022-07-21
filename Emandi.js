var sixr = 'add_six_r';
var niner = 'NineR';
var ninerSubmit = 'NineRSubmit';
var gatepass = 'add_gatepass';
var print9R = 'print_9R';
var printGatepass = 'print_gatepass';

var validRoutes = [sixr, niner, ninerSubmit, gatepass, print9R, printGatepass];
var route = window.location.href.split('/').pop();

if (!validRoutes.includes(route))
    throw new Error('Injection not valid for this page');

var css = document.createElement("style");
css.innerHTML = "br {display: block; content: \"\"; margin-top: 8px; } #myModal { display: block; padding: 10px; border-radius:4px; position: fixed; z-index: 100; margin-top:100px; top: 0; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); } #zContent{ background-color: #fefefe; border-radius:4px; padding: 20px; border: 1px solid #888; display: flex; flex-direction: column; align-items: center; justify-content: center; }";
document.getElementsByTagName('head')[0].append(css);

var util = document.createElement("script");
util.innerHTML = "function get(id){ return document.getElementById(id); }; function Capitalize(str){ var result = ''; let tokens = str.trim().split(' '); for(var token of tokens){ result += token[0].toUpperCase() + token.slice(1) + ' '; } return result.trim(); };";
document.getElementsByTagName('body')[0].append(util);

var scripts = {
    'add_six_r': "get('rateofcrop').addEventListener('DOMSubtreeModified', (event) => {get('crop_rate').value = '900'; get('crop_rate').dispatchEvent(new Event('change'));}); var event = new Event('change'); function mSubmit(){ get('vikreta_details').value = Capitalize(get('sname').value); get('vikreta_mobile').value = '7037433280'; get('ForSelf').checked = true; get('ForSelf').dispatchEvent(event); get('crop_code').value = '58'; get('crop_code').dispatchEvent(event); get('crop_type').value = 'Mota'; get('crop_weight').value = parseFloat(get('quantity').value).toFixed(3); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none'; }",
    'NineR': "function mSubmit(){ get('buyer_state').checked = true; get('buyer_state').dispatchEvent(new Event('change')); get('ForSelf').checked = true; get('ForSelf').dispatchEvent(new Event('change')); get('crop_code').value = '58'; get('crop_code').dispatchEvent(new Event('change')); get('kreta_details').value = Capitalize(get('bname').value); get('StockTypeCategory').value = '1'; get('StockTypeCategory').dispatchEvent(new Event('change')); document.getElementsByName('PayType')[1].checked = true; console.log('DOing'); document.getElementsByName('PayType')[1].dispatchEvent(new Event('change'));  get('myModal').style.display = 'none'; };",
    'NineRSubmit': "get('cost').addEventListener('change', (event) => {  get('crop_type').value = 'Mota'; get('mandi_rate5').value = '0'; get('mandi_rate5').dispatchEvent(new Event('change')); get('mandi_rate6').value = '0'; get('mandi_rate6').dispatchEvent(new Event('change')); get('mandi_rate7').value = '0'; get('mandi_rate7').dispatchEvent(new Event('change')); get('mandi_rate8').value = '0'; get('mandi_rate8').dispatchEvent(new Event('change'));});  Object.defineProperty(get('cost'), \"value\", { get: function() { return this.getAttribute('value'); }, set: function(val) { if(val && val != this.getAttribute('value')) {this.dispatchEvent(new Event('change'));} this.setAttribute(\"value\", val); }});  document.querySelector('input[type=\"checkbox\"]').checked = true; document.querySelector('input[type=\"checkbox\"]').dispatchEvent(new Event('click')); function mSubmit(){ document.getElementsByClassName('weights')[0].value = document.getElementsByClassName('Currentweights')[0].value; document.getElementsByClassName('weights')[0].dispatchEvent(new Event('change')); get('rate').value = '900'; get('rate').dispatchEvent(new Event('change')); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none';};",
    'add_gatepass': "get('nine_r_id').value = get('nine_r_id').options[1].value; get('nine_r_id').dispatchEvent(new Event('change')); function mSubmit() { get('dist_ofdestination').value = get('space').value; get('home_center').value = Capitalize(get('destination').value); get('vehicle').value = get('carrier').value; get('vehicle').dispatchEvent(new Event('change')); get('vehicle_no').value = get('carrier-no').value.toUpperCase(); get('bundle_no').value = get('packets').value; get('state').value = 'other'; get('state').dispatchEvent(new Event('change')); get('other_state_mandi').value = Capitalize(get('statename').value); get('DNTCaptchaInputText').value = get('in-captcha').value; get('myModal').style.display = 'none'; }",
    'print_9R': "function Print(download){ var tables = []; var content = document.querySelector('body > div.row > #content'); tables.push(content.querySelector('.table').outerHTML); tables.push(content.querySelector('.row .col-md-12 table').outerHTML); var data = { 'name': 'niner', 'tables': tables, 'qr': content.querySelector('#qrcode img').src, 'download': download }; var xhttp = new XMLHttpRequest(); xhttp.onload = function () { if (xhttp.status != 201) { alert(`Error ${xhttp.status}: ${xhttp.response}`); } else { if(download){ window.open('https://automationfxapp.azurewebsites.net/files/'+xhttp.response); } else { alert('Print Job Created!'); }}}; xhttp.open('POST', 'https://automationfxapp.azurewebsites.net/html', true); xhttp.setRequestHeader('Content-Type', 'application/json;'); xhttp.send(JSON.stringify(data)); get('myModal').style.display = 'none';}",
    'print_gatepass': "function Print(download){ var tables = []; var content = document.querySelector('body > div.row > #content'); tables.push(content.querySelector('.table').outerHTML); tables.push(content.querySelector('.row .col-md-12 table').outerHTML); tables.push(content.querySelectorAll('.row .col-md-12 table')[1].outerHTML); tables.push(content.querySelectorAll('.row .col-md-12 .row')[0].outerHTML); var data = { 'name': 'gatepass', 'tables': tables, 'qr': content.querySelector('#qrcode img').src, 'download': download }; var xhttp = new XMLHttpRequest(); xhttp.onload = function () { if (xhttp.status != 201) { alert(`Error ${xhttp.status}: ${xhttp.response}`); } else { if(download){ window.open('https://automationfxapp.azurewebsites.net/files/'+xhttp.response); } else { alert('Print Job Created!'); }}}; xhttp.open('POST', 'https://automationfxapp.azurewebsites.net/html', true); xhttp.setRequestHeader('Content-Type', 'application/json'); xhttp.send(JSON.stringify(data)); get('myModal').style.display = 'none';}"
}

var script = document.createElement("script");
script.innerHTML = scripts[route];

if (route == gatepass) {
    document.getElementById('PaidType').value = document.getElementById('PaidType').options[1].value;
    document.getElementById('PaidType').dispatchEvent(new Event('change'));
    setTimeout(function () {
        document.getElementsByTagName('body')[0].append(script);
    }, 10000);
}
else
    document.getElementsByTagName('body')[0].append(script);

var modal = document.createElement("div");
modal.style = "display: flex; align-items:center; justify-content: center";

var modals = {
    'add_six_r': '<div id="myModal"><div id="zContent"><><input type="text" id="sname" placeholder="Seller Name" /><br><input type="text" id="quantity" placeholder="Quantity (In Quintals)" /><br><div id="img-captcha"></div><br><input type="text" placeholder="Captcha Code" id="in-captcha"/><br><button onclick="mSubmit()">Submit</button></div></div>',
    'NineR': '<div id="myModal"><div id="zContent"><input type="text" id="bname" placeholder="Buyer Name" /><br><button onclick="mSubmit()">Submit</button></div></div>',
    'NineRSubmit': '<div id="myModal"><div id="zContent"><div id="img-captcha"></div><br><input type="text" placeholder="Captcha Code" id="in-captcha"/><br><button onclick="mSubmit()">Submit</button></div></div>',
    'add_gatepass': '<style>input[type=text]{width: 100%;}</style><div id="myModal"><div id="zContent"><input type="text" id="destination" placeholder="Destined Market" onchange = "(()=>{  document.getElementById(\'iframe\').src = \'https://www.google.com/search?igu=1&q=sadabad to \'+document.getElementById(\'destination\').value;  })()" /><br><select id="carrier" placeholder="Select Vehicle" style="width: 100%; height:27px;"><option value="1">Truck</option><option value="2">Pick-Up</option><option value="4">DCM</option></select><br><input type="text" id="carrier-no" placeholder="Vehicle Number" /><br><input type="text" id="packets" placeholder="Packets" /><br><input type="text" id="statename" placeholder="State" /><br><div id="img-captcha"></div><br><input type="text" placeholder="Captcha Code" id="in-captcha"/><br><input type="text" placeholder="Distance" id="space" /><br><button onclick="mSubmit()">Submit</button><br><iframe src="https://www.google.com/search?igu=1" id="iframe" /><br></div></div>',
    'print_9R': '<div id="myModal"><div id="zContent"><br><div style="display: flex;" id="msgholder"><input type="checkbox" id="download">&nbsp;Only download the document.</div><br><button onclick="Print(document.getElementById(\'download\').checked)">Print Document</button></div></div>',
    'print_gatepass': '<div id="myModal"><div id="zContent"><br><div id="msgholder" style="display: flex;"><input type="checkbox" id="download">&nbsp;Only download the document.</div><br><button onclick="Print(document.getElementById(\'download\').checked)">Print Document</button></div></div>'
}

modal.innerHTML = modals[route];

if (route.includes('print')) {
    document.getElementById('content').append(modal);
}
else {
    document.getElementById('ui').append(modal);
    if (route != niner)
        document.getElementById('img-captcha').append(document.getElementById('dntCaptchaImg'));
}