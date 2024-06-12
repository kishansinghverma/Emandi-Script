import { getNinerById, getSixrById, handleJsonResponse, hideLoader, showLoader } from "../services/utils.js";

class ListEntries {
    initializeForm = () => {
        document.getElementById('filter').click();
    }
}

class ListGatepasses {
    gatepassUrl = '/Receipt/print_gps';
    ninerUrl = '/Receipt/print_9rs';
    sixrUrl = '/Receipt/print_6rs';

    initializeForm = async () => {
        this.injectSwitch();
        $('#filter').click();
    }

    injectSwitch = () => {
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

    printNiner = ({ target }) => {
        showLoader();
        getNinerById($(target).text())
            .then(({ id }) => window.open(`${this.ninerUrl}/${id}`, '_blank'))
            .finally(hideLoader);
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
}

export const List_Entries = new ListEntries();

export const List_Gatepasses = new ListGatepasses();