import { MessageType } from "../constants.js";
import { sendGatepassById, sendNinerById } from "../services/delivery.js";
import { alertError, getActionButton, getDateOnly, getNinerById, getSixrById, handleJsonResponse, hideLoader, showAlert, showLoader } from "../services/utils.js";

class ListEntries {
    initializeForm = () => {
        document.getElementById('filter').click();
    }
}

class GeneratedNineR {
    initializeForm = () => {
        $('#filter').click()
        this.attachObserver();
        this.updateColumns();
    }

    processRecipt = (e, print, download, share) => {
        const row = $(e.currentTarget).closest('tr');
        const data = $('#datatable1').DataTable().row(row).data();
        const ninerNumber = data?.serial_number;
        const date = getDateOnly(data?.created_at);

        if (ninerNumber && date) {
            showLoader("Processing Niner...");
            sendNinerById(ninerNumber, date, print, download, share).catch(alertError).finally(hideLoader);
        }
        else showAlert(MessageType.Error, 'Niner Number Not Available!', 5);
    }

    viewReciept = (e => {
        const row = $(e.currentTarget).closest('tr');
        const data = $('#datatable1').DataTable().row(row).data();
        const recordId = data?.id;

        if (recordId != null) window.open(`/Receipt/print_9rs/${recordId}`, '_blank', 'noopener, noreferrer');
        else showAlert(MessageType.Error, 'Niner Id Not Available!', 5);
    });

    printReciept = (e => this.processRecipt(e, true, false, false));
    downloadReciept = (e => this.processRecipt(e, false, true, false));
    shareReciept = (e => this.processRecipt(e, false, false, true));

    updateColumns = () => {
        $('#datatable1').addClass('niner-table');
        $('#datatable1.niner-table thead tr th:last').text('कार्रवाई');
    }

    injectActions = () => {
        if ($('#datatable1').DataTable()?.rows()?.data()?.length === 0) return;

        $('#datatable1 tbody tr').each((_, row) => {
            const column = $(row).find('td:last');
            if (column.find('.button-wrapper').length) return;

            const buttonWrapper = $('<div>').addClass('button-wrapper').appendTo(column);
            buttonWrapper.append(getActionButton('fa-eye', 'btn-warning', 'View', this.viewReciept));
            buttonWrapper.append(getActionButton('fa-whatsapp', 'btn-success', 'Send', this.shareReciept));
            buttonWrapper.append(getActionButton('fa-print', 'btn-primary', 'Print', this.printReciept));
            buttonWrapper.append(getActionButton('fa-download', 'btn-info', 'Download', this.downloadReciept));
        });
    };

    attachObserver = () => {
        const tbody = document.querySelector('#datatable1 tbody');
        if (!tbody) return;

        const tableObserver = new MutationObserver(() => this.injectActions());
        tableObserver.observe(tbody, { childList: true });
    }
}

class ListGatepasses {
    gatepassUrl = '/Receipt/print_gps';
    ninerUrl = '/Receipt/print_9rs';
    sixrUrl = '/Receipt/print_6rs';

    initializeForm = async () => {
        $('#filter').click();
        this.updateColumns();
        this.injectAdminSwitch();
        this.attachObserver();
    }

    updateColumns = () => {
        this.tableHeader = $('.dataTables_scrollHeadInner table thead tr').clone();
        this.tableHeader.find('th').removeAttr('style');
        [9, 5, 3].forEach(index => { this.tableHeader.find(`th:nth-child(${index})`).remove() });

        this.tableHeader.find('th').eq(-5).text('टैगिंग का स्थान');
        this.tableHeader.find('th').eq(-2).text('स्वीकृति');
        this.tableHeader.find('th').eq(-1).text('कार्रवाई');
        $('.dataTables_scrollBody #datatable1').addClass('gatepass-table');
    }

    injectAdminSwitch = () => {
        const handleSwitch = ({ target }) => {
            if (target.checked) {
                this.modifyTable();
                $('#filter').off('click').click(this.initializeTable).click();
                $(target).attr('disabled', true);
            }
        };

        $('#content .ui-content-body .clearfix .col-md-4')
            .append($('<input>').attr('type', 'checkbox').attr('id', 'admin-check').click(handleSwitch))
            .append($('<span>').text('Turn On Admin Mode').addClass('admin-label'))
            .css('text-align', 'center');
    }

    attachObserver = () => {
        const table = document.querySelector('#datatable1');
        if (!table) return;

        const tableObserver = new MutationObserver(() => {
            this.injectHeaders();
            this.injectActions();
        });

        tableObserver.observe(table, { childList: true });
    }

    injectHeaders = () => $('#datatable1 thead').empty().append(this.tableHeader);;

    injectActions = () => {
        if ($('#datatable1')?.DataTable()?.rows()?.data()?.length === 0) return;

        $('#datatable1 tbody tr').each((_, row) => {
            const column = $(row).find('td:last');
            if (column.find('.button-wrapper').length) return;

            $(row).find('td:last').prev().html($(row).find('td:last').html()).end().empty();
            const buttonWrapper = $('<div>').addClass('button-wrapper').appendTo(column);
            buttonWrapper.append(getActionButton('fa-eye', 'btn-warning', 'View', this.viewReciept))
            buttonWrapper.append(getActionButton('fa-whatsapp', 'btn-success', 'Send', this.shareReciept))
            buttonWrapper.append(getActionButton('fa-print', 'btn-primary', 'Print', this.printReciept))
            buttonWrapper.append(getActionButton('fa-download', 'btn-info', 'Download', this.downloadReciept));
            
            const taggingStatus = $('#datatable1')?.DataTable()?.rows(row).data()?.[0]?.isVehicleTagging;
            if (taggingStatus !== "1") $(row).children().eq(10).html("<div class='text-red'>Not Tagged</div>");
            else $(row).children().eq(9).append('<br>').append($(row).children().eq(8).text())
        });
    }

    calculateBreakUp = async ({ target }) => {
        const column = $(target).parent();
        const ninerId = column.parent().find('td.niner a').text();
        const { six_r_id } = await getNinerById(ninerId);
        const sixrIds = six_r_id.split(',');
        column.html('<table class="break-up">');

        for (const [index, sixrId] of sixrIds.entries()) {
            const { id, crop_rate, total_amount, crop_qty, serial_number } = await getSixrById(sixrId);

            const headRow = $('<tr>')
                .append($('<td>').attr('rowspan', 2).text(index + 1))
                .append($('<th>').attr('colspan', 3).html($('<a>').text(serial_number).attr('href', `${this.sixrUrl}/${id}`).attr('target', '_blank').addClass('sixr-id')))

            const dataRow = $('<tr>')
                .append($('<td>').text(crop_qty))
                .append($('<td>').text(crop_rate))
                .append($('<td>').text(total_amount).addClass('amount'));

            column.find('table').append(headRow).append(dataRow);
        };
        $('#datatable-gp').animate({ scrollTop: column.find('table').offset().top }, 200);
    }

    initializeTable = () => {
        showLoader('Fetching Records...');
        $('#datatable-gp tbody').empty();

        const formData = new FormData();
        formData.append('draw', 1);
        formData.append('order[0][column]', 1);
        formData.append('order[0][dir]', 'desc');
        formData.append('start', 0);
        formData.append('length', -1);
        formData.append("fromDate", $("#from_date").val());
        formData.append("toDate", $("#to_date").val());

        fetch('/Traders/SP_Get_Gatepass_List', { method: 'POST', body: formData })
            .then(handleJsonResponse)
            .then(({ data }) => data.forEach(item => {
                const row = $('<tr>');
                row.append($('<td>').text(item.created_at))
                row.append($('<td>').html($('<a>').text(item.serial_number).attr('href', `${this.gatepassUrl}/${item.id}`).attr('target', '_blank')))
                row.append($('<td>').html($('<a>').text(item.nine_r_id).click(this.printNiner)).addClass('niner'))
                row.append($('<td>').text(item.kreta_mandi))
                row.append($('<td>').text(item.vehicle_no))
                row.append($('<td>').text(item.crop_weight))
                row.append($('<td>').html($('<a>').text('Show').click(this.calculateBreakUp)))
                row.appendTo($('#datatable-gp tbody'));
            })).finally(() => {
                $('#datatable-gp tbody tr').length > 0 ? $('.no-content').hide() : $('.no-content').show();
                hideLoader();
            });
    }

    modifyTable = () => {
        $('<table id="datatable-gp">')
            .append('<thead><tr></tr></thead>')
            .append('<tbody>')
            .append('<tfoot class="no-content"><tr><td colspan="7">No data available in table!</td></tr></tfoot>')
            .appendTo($('.panel-body.table-responsive').empty());

        ['Date', 'Gatepass Id', 'Niner Id', 'Trader', 'Vehicle No.', 'Weight', 'Break Up'].forEach(item => {
            $('#datatable-gp thead tr').append($('<th>').html(item));
        });
    }

    processRecipt = (e, print, download, share) => {
        const row = $(e.currentTarget).closest('tr');
        const data = $('#datatable1').DataTable().row(row).data();
        const gatepassNumber = data?.serial_number;
        const date = data?.created_at;

        if (gatepassNumber && date) {
            showLoader("Processing Gatepass...");
            sendGatepassById(gatepassNumber, date, print, download, share).catch(alertError).finally(hideLoader);
        }
        else showAlert(MessageType.Error, 'Gatepass Number Not Available!', 5);
    }

    viewReciept = (e => {
        const row = $(e.currentTarget).closest('tr');
        const data = $('#datatable1').DataTable().row(row).data();
        const recordId = data?.id;

        if (recordId != null) window.open(`/Receipt/print_gps/${recordId}`, '_blank', 'noopener, noreferrer');
        else showAlert(MessageType.Error, 'Gatepass Id Not Available!', 5);
    });

    printReciept = (e => this.processRecipt(e, true, false, false));

    downloadReciept = (e => this.processRecipt(e, false, true, false));

    shareReciept = (e => this.processRecipt(e, false, false, true));
}

export const List_Entries = new ListEntries();
export const Generated_NineR = new GeneratedNineR();
export const List_Gatepasses = new ListGatepasses();
