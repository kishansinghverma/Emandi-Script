import { LoadingIcon } from "./assets.js";

const BlankModal = `<div />`;

const add_six_r = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="sname" placeholder="Seller Name" />
		<hr>
		<input type="text" id="quantity" placeholder="Quantity (In Quintals)" />
		<hr>
		<div id="img-captcha"></div>
		<hr>
		<input type="text" placeholder="Captcha Code" id="in-captcha" oninput="window.formContext.AllowUpdate(this.value)"/>
		<hr>
        <div class="buttons">
            <button onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
        </div>
	</div>
</div>
`
const NineR = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="bname" placeholder="Buyer Name" />
		<hr>
        <div class="buttons">
            <button onclick="window.formContext.UpdateForm()">Update</button>
		    <button onclick="window.formContext.Next()" disabled id="nextBtn">Next</button>
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
	<div id="modalContent" class="modal-content">
		<div id="record" style="display: none"></div>
        <div id="img-captcha"></div>
        <hr>
        <input type="text" placeholder="Captcha Code" id="in-captcha" oninput="window.formContext.AllowUpdate(this.value)"/>
        <hr>
        <div class="buttons">
            <button onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
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
	<div id="modalContent" class="modal-content">
		<div id="record">
        ${LoadingIcon}
        </div>
		<hr class="hr">
		<input type="text" id="destination" placeholder="Destined Market" />
		<hr>
		<select id="carrier" placeholder="Select Vehicle" style="width: 100%; height:27px;">
			<option value="1">Truck</option>
			<option value="2">Pick-Up</option>
			<option value="4">DCM</option>
		</select>
		<hr>
		<input type="text" id="carrier-no" placeholder="Vehicle Number" />
		<hr>
		<input type="text" id="packets" placeholder="Packets" />
		<hr>
		<input type="text" id="statename" placeholder="State" />
		<hr>
        <input type="text" placeholder="Distance" id="space" />
		<hr>
		<div id="img-captcha"></div>
		<hr>
		<input type="text" placeholder="Captcha Code" id="in-captcha"/>
		<hr>
        <div class="buttons">
            <button onclick="window.formContext.UpdateForm()" disabled id="updateBtn">Update</button>
		    <button onclick="window.formContext.PreviewForm()" disabled id="previewBtn">Preview</button>
        </div>
	</div>
</div>`;

const Print = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="modal-content">
        <hr>
        <div style="display: flex;" id="msgholder">
            <input type="checkbox" id="download">&nbsp;Only download the document.
        </div>
        <hr>
        <button onclick="window.formContext.Print(document.getElementById(\'download\').checked)">Print Document</button>
	</div>
</div>
`

export const Modals = { 
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