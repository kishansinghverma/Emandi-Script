import { FetchParams, MessageType, SplitwiseGroupId, StageMap, Stages, Status, Url } from "../constants.js";
import { Form } from "../services/form.js";
import { ShowAlert, AlertError, HandleResponse, ShowLoader } from "../services/utils.js";
import { ResolveCaptcha, SetResolvedCaptcha, ValidateCaptcha } from "../services/captcha.js";
import { ExpressConfig } from "../services/express.js";

class NinerSubmit extends Form {
    InitializeForm() {
        this.CheckPaidSixR();
        this.FetchRecord();
        this.AttachListener();
        this.ExecuteInitialActions();
    }

    AttachListener() {
        $(document).ajaxSuccess((event, jqXHR, ajaxOptions) => this.PostAjaxCall(ajaxOptions.url, jqXHR?.responseJSON));
        $('#in-captcha').on('change', ({ target }) => this.AllowUpdate(target.value));
    }

    ExecuteInitialActions() {
        $('#img-captcha').append($('#dntCaptchaImg'));
        $('#crop_type').val('Regular');
        $('input[type="checkbox"]').first().click();
        this.CaptchaResolver = ResolveCaptcha('dntCaptchaImg');
        this.CaptchaResolver.then(value => SetResolvedCaptcha(value, 'in-captcha')).catch(AlertError);

        if (this.Configuration) ExpressConfig.SetConfiguration({ ...this.Configuration, Status: Status.Init });
        ExpressConfig.ExecuteViaExpress(() => this.RunHeadless());
    }

    CheckPaidSixR() {
        if (!$('#dntCaptchaImg')[0]) {
            ShowAlert(MessageType.Error, "No Paid 6R found!", 3);
            $('#customModal').hide();
            throw new Error('No Paid 6R found!');
        }
    }

    PreviewForm = () => preview_data();

    OnComplete() {
        if (this.Configuration) {
            ExpressConfig.SetConfiguration({
                ...this.Configuration,
                Stage: Stages.Gatepass,
                Status: Status.Init
            });
        }

        window.location.href = StageMap[Stages.Gatepass].Url;
    }

    OnFormSave() {
        ShowAlert(MessageType.Success, "Niner Created Successfully.", 3);
        if (window.isPrepaid) {
            const formData = {
                ...FetchParams.Post,
                body: JSON.stringify({
                    cost: `${parseInt($('#takenQty').html()) * $('#rate').val() * 1.5/100}`,
                    description: $('#SpanKretaAddrss').html(),
                    details: $('.chk:checked').parent().parent().find('.instrumentNumber').map((index, item) => item.value).toArray().join('\n'),
                    group_id: SplitwiseGroupId["Prepaid Gatepass"],
                })
            };

            ShowLoader('Saving Transaction');
            fetch(Url.SplitwiseExpense, formData)
                .then(HandleResponse)
                .then(() => ShowAlert(MessageType.Success, 'Transaction Saved successfully...', 3))
                .catch(AlertError)
                .finally(() => {
                    if (this.Record) {
                        ShowLoader('Updating Record');
                        const requestParams = {
                            ...FetchParams.Post,
                            body: JSON.stringify({
                                Rate: $('#rate').val(),
                                Mode: 'Prepaid'
                            })
                        };

                        fetch(Url.UpdateRecord, requestParams)
                            .then(HandleResponse)
                            .catch(AlertError)
                            .finally(() => this.OnComplete());
                    }
                    else this.OnComplete();
                });
        }
        else this.OnComplete();
    }


    PostAjaxCall(url, response) {
        if (Array.isArray(response) && response.length > 0) {
            if (url.includes('/Traders/NineRSubmit')) {
                // Validate Captcha is correctly parsed.
                ValidateCaptcha(response);

                //Handles form sumission.
                if (response[0].status > 0)
                    this.OnFormSave();
            }
        }
    }

    SelectEntries() {
        if (this.Record) {
            let targetQuantity = this.Record.Weight;
            const entries = $('#tblData1 > tbody:nth-child(2) > tr').not(':last');

            entries.each((index, row) => {
                $(row).find('.chk').prop('checked', true);
                const weight = parseInt($(row).find('.Currentweights').val());

                if (targetQuantity <= weight) {
                    $(row).find('.weights').val(targetQuantity).trigger('change');
                    return false;
                }
                else {
                    $(row).find('.weights').val(weight).trigger('change');
                    targetQuantity -= weight;
                }
            });

            if (parseInt(this.Record.Weight) === parseInt($('#takenQty').html()))
                ShowAlert(MessageType.Success, `Quantity Selected : ${$('#takenQty').html()} Quintal.`, 3)
            else {
                ShowAlert(MessageType.Error, 'Quantity Unavailable! Select Manually...', 5);
                throw new Error('Select Manually...');
            }
        }
    }

    UpdateForm() {
        this.SelectEntries();
        $('#rate').val($('#cropminrate').val()).trigger('change');
        $('#DNTCaptchaInputText').val($('#in-captcha').val());
        $('#previewBtn').removeAttr('disabled');
    }

    RunHeadless() {
        this.CaptchaResolver.then(() => {
            this.UpdateForm();
            $('#loader').show();
            $.ajax({
                url: $("#form1").attr("action"),
                method: "post",
                data: $('#form1').serialize(),
                async: false
            });
            $('#loader').hide();
        })
    }
}

export const NineRSubmit = new NinerSubmit();