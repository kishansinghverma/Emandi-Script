const getCellValue = ($el) => {
    if (!$el || !$el.length) return '';
    if ($el.find('label').length) {
        return $el.find('label').first().text().trim();
    }
    const inputVal = $el.find('input, textarea, select').first().val();
    if (inputVal !== undefined && inputVal !== null) {
        return inputVal.trim();
    }
    return $el.text().trim();
};

const getFieldByLabel = ($container, labelText) => {
    const clean = (s) => (s || '').normalize('NFC').replace(/[\s:：-]+/g, ' ').trim();
    const cleanLabel = clean(labelText);
    const cells = $container.find('td, th').toArray();

    let matchedEl = cells.find(el => clean($(el).text()) === cleanLabel);

    if (!matchedEl) {
        matchedEl = cells.find(el => clean($(el).text()).startsWith(cleanLabel));
    }

    if (!matchedEl) return '';

    const $cell = $(matchedEl);
    const $nextCell = $cell.next('td, th');
    if ($nextCell.length) {
        return getCellValue($nextCell);
    }

    return '';
};

export const parseNinerReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content').addBack('#content').first();
    const root = $contents.length ? $contents : $element;

    const qr = root.find('#qrcode img').attr('src') || (root.find('#qrcode canvas')[0]?.toDataURL?.()) || '';
    const book_number = getFieldByLabel(root, 'पुस्तक संख्या');
    const serial_number = getFieldByLabel(root, 'क्रम संख्या');
    const dateofissue = getFieldByLabel(root, 'विक्रय/ नीलाम का दिनांक');
    const mandi_name = getFieldByLabel(root, 'मंडी');
    const trade_mandi = getFieldByLabel(root, 'मंडी क्षेत्र में प्रधान स्थल');
    const trader_license_number = getFieldByLabel(root, 'आढ़तिया / व्यापारी का लाइसेंस संख्या');
    const vikreta_details = getFieldByLabel(root, 'आढ़तिया / व्यापारी फर्म का नाम व जिला');
    const trader_name = getFieldByLabel(root, 'आढ़तिया / व्यापारी का नाम');
    const buyer_state = getFieldByLabel(root, 'क्रेता फर्म का राज्य');
    const buyer_license_no = getFieldByLabel(root, 'क्रेता का लाइसेंस संख्या');
    const kreta_details = getFieldByLabel(root, 'क्रेता फर्म का नाम व जिला');
    const vehicleName = getFieldByLabel(root, 'वाहन');
    const vehicle_no = getFieldByLabel(root, 'वाहन संख्या');

    const $tabLogic = root.find('#tab_logic');
    const crop_name_hi = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(0)'));
    const crop_code = crop_name_hi;
    const crop_type = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(1)'));
    const crop_weight = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(2)'));
    const crop_rate = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(3)'));
    const crop_amount = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(4)'));

    const $feesCell = $tabLogic.find('tbody tr:eq(0) td:eq(5)');
    const feesText = $feesCell.text();
    const extractFee = (label) => {
        const match = feesText.match(new RegExp(label + '\\s*:\\s*([^\\n<]+)'));
        return match ? match[1].trim() : undefined;
    };

    const mandi_fee = extractFee('मंडी शुल्क');
    const dev_fee = extractFee('विकास सेस');
    const weighing_fee = extractFee('तौलाई');
    const commission_fee = extractFee('दलाली');
    const porter_fee = extractFee('पल्लेदारी');
    const tax = extractFee('टैक्स');
    const agent_fee = extractFee('आढ़त');
    const other_fee = extractFee('अन्य व्यय');

    const totalTaxMatch = feesText.match(/कुल व्यापारिक परिव्यय\s*:\s*([^\n<]+)/);
    const total_tax = totalTaxMatch ? totalTaxMatch[1].trim() : '';
    const total_amount = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(6)'));
    const six_r_id = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(7)'));

    const payload = {
        book_number,
        serial_number,
        dateofissue,
        mandi_name,
        trade_mandi,
        trader_license_number,
        vikreta_details,
        trader_name,
        buyer_state,
        buyer_license_no,
        kreta_details,
        vehicleName,
        vehicle_no,
        crop_code,
        crop_type,
        crop_weight,
        crop_rate,
        crop_amount,
        mandi_fee,
        dev_fee,
        weighing_fee,
        commission_fee,
        porter_fee,
        tax,
        agent_fee,
        other_fee,
        total_tax,
        total_amount,
        six_r_id
    };

    if (!payload.serial_number) {
        throw new Error('Unable To Parse Niner Receipt.');
    }

    return { payload, qr };
};

export const parseGatepassReceipt = (element) => {
    const $element = $(element);
    const $contents = $element.find('#content').addBack('#content').first();
    const root = $contents.length ? $contents : $element;

    const qr = root.find('#qrcode img').attr('src') || (root.find('#qrcode canvas')[0]?.toDataURL?.()) || '';
    const book_number = getFieldByLabel(root, 'पुस्तक संख्या');
    const serial_number = getFieldByLabel(root, 'गेटपास संख्या');
    const uniquecode = getFieldByLabel(root, 'आवेदन संख्या');
    const dateofissue = getFieldByLabel(root, 'जारी करने का दिनांक');
    const timeofissue = getFieldByLabel(root, 'जारी करने का समय');
    const nine_r_id = getFieldByLabel(root, 'सलंग्न प्रपत्र-9 की संख्या');
    const dist_todestination = getFieldByLabel(root, 'गंतव्य की दूरी');
    const home_center = getFieldByLabel(root, 'सीमांत गृह केंद्र का नाम');
    const center_code = getFieldByLabel(root, 'कोड');
    const fullCropName = getFieldByLabel(root, 'उत्पाद का नाम');
    const crop_weight = getFieldByLabel(root, 'वजन (कुंतल');

    const cropMatch = fullCropName.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    const crop_name_hi = cropMatch?.[1]?.trim() || fullCropName;
    const crop_name = cropMatch?.[2]?.trim() || '';

    const $tabLogic = root.find('#tab_logic');
    const trader_name = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(0)'));
    const $vehicleCell = $tabLogic.find('tbody tr:eq(0) td:eq(1)');
    const $vehicleLabels = $vehicleCell.find('label');
    let vehicle = '';
    let vehicle_no = '';
    if ($vehicleLabels.length >= 2) {
        vehicle = $vehicleLabels.eq(0).text().trim();
        vehicle_no = $vehicleLabels.eq(1).text().trim();
    } else if ($vehicleLabels.length === 1) {
        vehicle = $vehicleLabels.eq(0).text().trim();
    } else {
        const lines = $vehicleCell.text().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        vehicle = lines[0] || '';
        vehicle_no = lines[1] || '';
    }

    const kreta_mandi = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(2)'));
    const kreta_mandiName = getCellValue($tabLogic.find('tbody tr:eq(0) td:eq(3)'));

    const crop_type = getCellValue($tabLogic.find('tbody tr:eq(1) td:eq(1)'));
    const bundle_no = getCellValue($tabLogic.find('tbody tr:eq(1) td:eq(2)'));
    const qty_parameter = getCellValue($tabLogic.find('tbody tr:eq(1) td:eq(4)'));

    const latitude = getFieldByLabel(root, 'Latitude');
    const longitude = getFieldByLabel(root, 'Longitude');
    const taggingDate = getFieldByLabel(root, 'टैगिंग का दिनांक');

    const dateofdestination = root.find('input[name="destination_time"], input.fixed-input').val()?.trim()
        || root.find('#destination_time').val()?.trim() || '';
    const estimated_travel_time = root.find('#avg_time').text().trim();
    const avg_speed = root.find('#avg_speed').text().trim();

    const payload = {
        uniquecode,
        book_number,
        serial_number,
        dateofissue,
        timeofissue,
        nine_r_id,
        dist_todestination,
        home_center,
        center_code,
        crop_name_hi,
        crop_name,
        crop_weight,
        trader_name,
        vehicle,
        vehicle_no,
        kreta_mandi,
        kreta_mandiName,
        crop_type,
        bundle_no,
        qty_parameter,
        latitude,
        longitude,
        taggingDate,
        dateofdestination,
        estimated_travel_time,
        avg_speed
    };

    if (!payload.serial_number || !payload.uniquecode) {
        throw new Error('Unable To Parse Gatepass Receipt.');
    }

    return { payload, qr };
};

export const getNinerPayload = (record) => ({
    book_number: record.book_number,
    serial_number: record.serial_number,
    dateofissue: record.dateofissue,
    mandi_name: record.mandi_name,
    trade_mandi: record.trade_mandi,
    trader_license_number: record.trader_license_number,
    vikreta_details: record.vikreta_details,
    trader_name: record.trader_name,
    buyer_state: record.buyer_state,
    buyer_license_no: record.buyer_license_no,
    kreta_details: record.kreta_details,
    vehicleName: record.vehicleName,
    vehicle_no: record.vehicle_no,
    crop_code: record.crop_code,
    crop_type: record.crop_type,
    crop_weight: record.crop_weight,
    crop_rate: record.crop_rate,
    crop_amount: record.crop_amount,
    mandi_fee: record.mandi_fee,
    dev_fee: record.dev_fee,
    weighing_fee: record.weighing_fee,
    commission_fee: record.commission_fee,
    porter_fee: record.porter_fee,
    tax: record.tax,
    agent_fee: record.agent_fee,
    other_fee: record.other_fee,
    total_tax: record.total_tax,
    total_amount: record.total_amount,
    six_r_id: record.six_r_id
});

export const getGatepassPayload = (record) => {
    if (!record.uniquecode) throw new Error("Gatepass unique code is not available.");

    return {
        uniquecode: record.uniquecode,
        book_number: record.book_number,
        serial_number: record.serial_number,
        dateofissue: record.dateofissue,
        timeofissue: record.timeofissue,
        nine_r_id: record.nine_r_id,
        dist_todestination: record.dist_todestination,
        home_center: record.home_center,
        center_code: record.center_code,
        crop_name_hi: record.crop_name_hi,
        crop_name: record.crop_name,
        crop_weight: record.crop_weight,
        trader_name: record.trader_name,
        vehicle: record.vehicle,
        vehicle_no: record.vehicle_no,
        kreta_mandi: record.kreta_mandi,
        kreta_mandiName: record.kreta_mandiName,
        crop_type: record.crop_type,
        bundle_no: record.bundle_no,
        qty_parameter: record.qty_parameter,
        latitude: record.latitude,
        longitude: record.longitude,
        taggingDate: record.taggingDate,
        dateofdestination: record.dateofdestination,
        estimated_travel_time: record.estimated_travel_time.trim(),
        avg_speed: record.avg_speed
    };
};