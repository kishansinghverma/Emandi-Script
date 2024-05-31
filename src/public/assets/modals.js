const BlankModal = `<div />`;

const header = `
<div class="custom-modal-header">
	<div>E-Mandi Assistant</div>
	<div class="link">&#x2715;</div>
</div>`;

const add_six_r = `
<div class="custom-modal">
	${header}
	<div class="custom-modal-content">
		<div class="record"></div>
		<input type="text" id="sname" placeholder="Seller Name" data-property="seller" />
		<input type="text" id="quantity" placeholder="Quantity (In Quintals)" data-property="weight"/>
		<input type="text" id="licence" placeholder="Party Licence" data-property="party.licenceNumber"/>
		<div id="img-captcha"></div>
		<input type="text" placeholder="Captcha Code" id="in-captcha" />
        <div class="btn-group">
			<button class="button info" id="refresh-btn">Refresh</button>
			<button class="button success" disabled id="submit-btn">Submit</button>
        </div>
	</div>
</div>`;

const NineR = `
<div class="custom-modal">
	${header}
	<div class="custom-modal-content">
		<div class="record"></div>
		<input type="text" id="bname" placeholder="Buyer Name" data-property="party.name,party.mandi,party.state"/>
		<div class="checkbox-wrapper">
			<input type="checkbox" id="is-licenced"/>
			<label for="is-licenced">Party Is Licenced</label>
		</div>
		<button class="button success" disabled id="next-btn">Next</button>
	</div>
</div>`;

const NineRSubmit = `
<div class="custom-modal">
	${header}
	<div class="custom-modal-content">
		<div class="record"></div>
		<input type="text" id="weight" placeholder="Weight" data-property="weight" />
        <div id="img-captcha"></div>
        <input type="text" placeholder="Captcha Code" id="in-captcha"/>
        <button class="button success" disabled id="submit-btn">Submit</button>
	</div>
</div>`;

const add_gatepass = `
<div class="custom-modal">
	${header}
	<div class="custom-modal-content">
		<div class="record"></div>
		<input type="text" id="destination" placeholder="Destined Market" data-property="party.name" />
		<div class="input-group">
			<select id="carrier" placeholder="Select Vehicle" data-property="vehicleType">
				<option selected disabled>Select Vehicle</option>
				<option value="1">Truck</option>
				<option value="2">Pick-Up</option>
				<option value="4">DCM</option>
			</select>
			<input type="text" id="carrier-no" placeholder="Vehicle Number" data-property="vehicleNumber" />
		</div>
		<div class="input-group">
			<input type="text" placeholder="Mandi" id="mandiname" data-property="party.mandi" />
			<select type="text" id="statename" data-property="party.stateCode">
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
		</div>
		<div class="input-group">
			<input type="text" id="packets" placeholder="Packets" data-property="bags" />
        	<input type="text" placeholder="Distance" id="space" data-property="party.distance" />
		</div>
		<div id="img-captcha"></div>
		<input type="text" placeholder="Captcha Code" id="in-captcha"/>
        <button class="button success" disabled id="submit-btn">Submit</button>
	</div>
</div>`;

const Print = `
<div class="custom-modal">
	${header}
	<div class="custom-modal-content">
		<div class="left-aligned">
			<input type="radio" id="print" name="printtype" />
			<label for="print">Print Document On Paper.</label>
		</div>
		<div class="left-aligned mb-1">
			<input type="radio" id="forcedownload" name="printtype" />
			<label for="forcedownload">Force Download.</label>
		</div>
        <button class="button success" id="print-btn">Send PDF</button>
	</div>
</div>`;

export const Modals = {
	Account: BlankModal,
	index: BlankModal,
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