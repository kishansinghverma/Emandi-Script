import { LoadingIcon } from "./loader.js";

const BlankModal = `<div />`;

const add_six_r = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="custom-modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="sname" placeholder="Seller Name" />
		<hr>
		<input type="text" id="quantity" placeholder="Quantity (In Quintals)" />
		<hr>
		<input type="text" id="licence" placeholder="Party Licence" />
		<hr>
		<div id="img-captcha"></div>
		<hr>
		<input type="text" placeholder="Captcha Code" id="in-captcha" oninput="window.formContext.AllowUpdate(this.value)"/>
		<hr>
        <div class="buttons">
            <button class="btn btn-info" onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button class="btn btn-success" onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
        </div>
		<button class="btn btn-warning" onclick="window.formContext.RunHeadless()" id="expressBtn">Express</button>
	</div>
</div>
`
const NineR = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="custom-modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="bname" placeholder="Buyer Name" />
		<hr>
        <div class="buttons">
            <button class="btn btn-info" onclick="window.formContext.UpdateForm()">Update</button>
		    <button class="btn btn-success" onclick="window.formContext.Next()" disabled id="nextBtn">Next</button>
        </div>
	</div>
</div>
`

const NineRSubmit = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="custom-modal-content">
		<div id="record" style="display: none"></div>
        <div id="img-captcha"></div>
        <hr>
        <input type="text" placeholder="Captcha Code" id="in-captcha" oninput="window.formContext.AllowUpdate(this.value)"/>
        <hr>
        <div class="buttons">
            <button class="btn btn-info" onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button class="btn btn-success" onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
        </div>
	</div>
</div>
`

const add_gatepass = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="custom-modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="destination" placeholder="Destined Market" />
		<hr>
		<select id="carrier" placeholder="Select Vehicle" style="width: 100%; height:27px;">
			<option selected disabled>Select Vehicle</option>
			<option value="1">Truck</option>
			<option value="2">Pick-Up</option>
			<option value="4">DCM</option>
		</select>
		<hr>
		<input type="text" id="carrier-no" placeholder="Vehicle Number" />
		<hr>
		<input type="text" id="packets" placeholder="Packets" />
		<hr>
		<select type="text" id="statename" style="width: 100%; height:27px;">
			<option selected disabled>Select State</option>
			<option value="1">उत्तर प्रदेश</option>
			<option value="2">उत्तराखंड</option>
			<option value="3">हरियाणा</option>
			<option value="4">झारखंड</option>
			<option value="5">राजस्थान</option>
			<option value="6">महाराष्ट्र</option>
			<option value="7">मध्य प्रदेश</option>
			<option value="8">छत्तीसगढ़</option>
			<option value="9">बिहार</option>
			<option value="10">आंध्र प्रदेश</option>
			<option value="11">अरुणाचल प्रदेश</option>
			<option value="12">असम</option>
			<option value="13">चंडीगढ़</option>
			<option value="14">दादरा और नागर ​​हवेली</option>
			<option value="15">दमन और दीव</option>
			<option value="16">दिल्ली</option>
			<option value="17">गोवा</option>
			<option value="18">गुजरात</option>
			<option value="19">हिमाचल प्रदेश</option>
			<option value="20">जम्मू कश्मीर</option>
			<option value="21">कर्नाटक</option>
			<option value="22">केरल</option>
			<option value="23">लक्षद्वीप</option>
			<option value="24">मणिपुर</option>
			<option value="25">मेघालय</option>
			<option value="26">मिजोरम</option>
			<option value="27">नागालैंड</option>
			<option value="28">उड़ीसा</option>
			<option value="29">पुडुचेरी</option>
			<option value="30">पंजाब</option>
			<option value="31">सिक्किम</option>
			<option value="32">तमिलनाडु</option>
			<option value="33">त्रिपुरा</option>
			<option value="34">पश्चिम बंगाल</option>
			<option value="35">अंडमान और निकोबार द्वीप</option>
			<option value="36">तेलंगाना</option>
			<option value="37">नेपाल</option>
		</select>
		<hr>
        <input type="text" placeholder="Mandi" id="mandiname" />
		<hr>
        <input type="text" placeholder="Distance" id="space" />
		<hr>
		<div id="img-captcha"></div>
		<hr>
		<input type="text" placeholder="Captcha Code" id="in-captcha"/>
		<hr>
        <div class="buttons">
            <button class="btn btn-info" onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button class="btn btn-success" onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
        </div>
	</div>
</div>`;

const Print = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="custom-modal-content">
		<div id="record">
        	${LoadingIcon}
        </div>
        <hr>
        <div style="display: flex;" id="msgholder">
            <input type="checkbox" id="download">&nbsp;Only download the document.
        </div>
        <hr>
        <button class="btn btn-success" onclick="window.formContext.Print(document.getElementById(\'download\').checked)">Print Document</button>
	</div>
</div>
`

export const Modals = {
	Account: BlankModal,
	index: BlankModal,
    'index?ReturnUrl=%2FAccount%2FLogOut': BlankModal,
    add_six_r,
    NineR,
    NineRSubmit,
    add_gatepass,
    DigitalPayment: BlankModal,
    GeneratedDigitalPayment: BlankModal,
    print_9R: Print,
    print_gatepass: Print,
	generated_9R: BlankModal,
	generated_gatepass: BlankModal
};