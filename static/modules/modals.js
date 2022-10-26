const add_six_r = `
<div id="customModal" class="custom-modal">
	<div class="head">
		<div style="color: #e7e9eb">Provide The Information</div>
		<button onclick="window.formContext.HideModal()">x</button>
	</div>
	<div id="modalContent" class="modal-content">
		<div id="record"></div>
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
		<div id="record"></div>
		<hr class="hr">
		<input type="text" id="bname" placeholder="Buyer Name" />
		<hr>
        <div class="buttons">
            <button onclick="window.formContext.UpdateForm()">Update</button>
		    <button onclick="window.formContext.PreviewForm()" disabled id="nextBtn">Next</button>
        </div>
	</div>
</div>
`

export const Modals = { 
    add_six_r,
    NineR
};