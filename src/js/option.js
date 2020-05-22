/**
 *
 * Setting pages action.
 *
 * Created by sdm on 14-1-18.
 * Updated by Riant at 2015-04-16
 */

$(function () {

    // Data model
    let model = window.Model;

    // Load domain & tags
    setTimeout(function () {
        let kw = model.getkws()[0] || '';
        $('#search-input').val(kw);
        window.Table.search(kw);
    });

    // Status
    let loadStatus = function () {
        use = model.getStatus()
        $("#status").prop("checked", use);
        $("#status").next().text(use ? lang.translate('On') : lang.translate('Off'));
    }
    loadStatus()
    $("#status").prop('checked', model.getStatus()).change(function () {
        model.setStatus(this.checked);
        loadStatus()
    });

    let settingsForm = {
        get: function () {
            return {
                id: Number($('#proxy-id').val()),
                name: $('#proxy-name').val(),
                value: $('#proxy-value').val(),
                use: $('#proxy-use').val().split('\n'),
            }
        },
        set: function (id, proxy) {
            $('#proxy-id').val(id);
            $('#proxy-name').val(proxy.name);
            $('#proxy-value').val(proxy.value);
            $('#proxy-use').val(proxy.use.join('\n'));
        },
        reload: function () {
            let proxyData = model.getProxy()
            proxyHtml = ''
            let proxy = proxyData[0]
            let id = 0
            proxyData.map(function (elem, index) {
                let selected = elem.status == 1 ? 'selected' : '';
                proxyHtml += '<option value="' + index + '" ' + selected + '>' + elem.name + '</option>'
                if (elem.status == 1) {
                    proxy = elem
                    id = index
                }
            });
            $('#proxy').html(proxyHtml);
            if (proxy) {
                this.set(id, proxy);
            } else {
                this.reset()
            }
        },
        reset: function () {
            this.set('', {
                name: '',
                value: '',
                use: [],
            });
        },
        submit: function () {
            let proxy = this.get();
            if (proxy.name == '') {
                formWarning('Please input Proxy Name.');
                return false;
            }
            if (proxy.value == '') {
                formWarning('Please input Proxy Value.');
                return false;
            }
            let id = model.addOrUpdateProxy(proxy);
            model.useProxy(id);
            this.reload();
            formWarning('Save success.');
        }
    }

    setTimeout(function () {
        settingsForm.reload();
    })
    $('#proxy').on('change', function () {
        let id = $(this).val();
        model.useProxy(id);
        settingsForm.reload();
    });
    $('#settings').on('submit', function () {
        settingsForm.submit();
        return false;
    });


    $('#language').on('change', function () {
        window.lang.change($(this).val());
    });

    Date.prototype.Format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function formWarning(text) {
        $('.formWarning span').text(text);
        $('.formWarning').slideDown();
        setTimeout(function () {
            $('.formWarning').slideUp();
        }, 3000)
    }

    $('#addForm').on('submit', function () {
        let info = {
            'id': Number($('#item-id').val()),
            'ip': $('#ip').val(),
            'domain': $('#domain').val(),
            'tags': [],
            'status': 1,
            'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
        };

        if (info.ip == '') {
            formWarning('Please input IP.');
            return false;
        }
        if (info.domain == '') {
            formWarning('Please input Domain.');
            return false;
        }

        let add_tags = $('#add_labels').val().split(',');
        $(add_tags).each(function (i, v) {
            if (v) {
                info.tags.push(v);
            }
        });

        $('#div_labels input[type="checkbox"]:checked').each(function () {
            info.tags.push(this.value);
        });

        model.addHost(info);
        $('#listBtn').trigger('click');
        window.Table.search($('#search-input').val());
        $('#host-' + info.id).addClass('editting');
        return false;
    });

    $('#bulkForm').on('submit', function () {
        let infos = $('#bulkAdd').val().split('\n');
        let rules = /^\s*([^\s]+)\s*([^\s]+)\s*([^\s]+)?\s*([^\s]+)?\s*$/;
        for (let i = 0, len = infos.length; i < len; i++) {
            let ipInfo = $.trim(infos[i]);
            if (ipInfo.indexOf('#') === 0) {
                continue;
            }
            let info = rules.exec(ipInfo) || [];
            if (info.length >= 3) {
                let item = {
                    'ip': $.trim(info[1]),
                    'domain': $.trim(info[2]),
                    'tags': '',
                    'note': $.trim(info[4]) ? $.trim(info[4]) : '',
                    'status': 0,
                    'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
                };

                let tags = $.trim(info[3]) ? $.trim(info[3]).split(',') : '';
                if (tags.length) {
                    item.tags = [];
                    $(tags).each(function (i) {
                        if (tags[i] !== '') item.tags.push(tags[i]);
                    });
                }

                model.addHost(item);
            }
        }
        window.Table.search('');
        $('#listBtn').trigger('click');
        return false;
    });

    $('#defaultMode').on('submit', function () {
        let mode = $('#input_mode').val(),
            use_val = $('#input_use').val(),
            use_list = use_val.split("\n");
        model.setStatus($("#status")[0].checked, mode, use_list);
        let res = $('#default option').each(function () {
            if ($(this).val() == mode) {
                return false;
            }
        });
        if (res != false) {
            $('#UserDefined').val(mode)
        }
        $('#default').val(mode)
        return false;
    });

    $('#select_all').change(function () {
        $('#tbody-hosts').find('input[type=checkbox]').prop('checked', this.checked).change();
    });

    $('#tbody-hosts').on('change', 'input', function (e) {
        let tr = $(this).parents('tr');
        if ($(this).prop('checked')) {
            tr.addClass('success');
        } else {
            tr.removeClass('success');
        }
        return false;
    });

    $('#but_del').click(function () {
        $('input[type=checkbox]:checked').each(function () {
            model.removeHost(this.value);
        });
        $('input[type=checkbox]:checked').parents('tr').remove();
        return false;
    });

    $(document).on('click', '.delete', function () {
        if (confirm('Delete Confirm')) {
            let id = $(this).data('id');
            model.removeHost(id);
            $('#host-' + id).remove();
            $('#addForm').reset();
        }
    });

    $(document).on('click', '.edit', function () {
        let id = $(this).data('id');
        let info = model.getHostById(id);
        $('#host-' + id).addClass('editting').siblings().removeClass('editting');
        $('#item-id').val(id);
        $('#ip').val(info.ip);
        $('#domain').val(info.domain);
        $('#div_labels input[type="checkbox"]').attr("checked", false);
        info.tags.map(function (elem) {
            $('#div_labels input[type="checkbox"][value="' + elem + '"]').attr('checked', true)
        })
    })

    $('#add_tab').find('a').on('click', function () {
        let target = $(this).data('target');
        if (target) {
            if ($(target).is('#addForm')) {
                $('#item-id').val('');
                ($(target)[0]).reset();
            }
            $(this).addClass('current').siblings().removeClass('current');
            $(target).addClass('current').siblings().removeClass('current');
            return false;
        } else {
            return true;
        }
    });

    if (location.hash === '#hosts') $('#listBtn').trigger('click');

    // export to json
    $('#export').on('click', function () {
        let br = '<br>';
        let hosts = model.getHosts();
        let str = br + "snail-hosts.data" + br
        for (let i in hosts) {
            let h = hosts[i]
            str += h.ip + " " + h.domain + " " + h.tags.toString() + br;
        }
        let proxy = model.nowUsedProxy();
        str += br + proxy.name + br;
        proxy.use.map(function (elem) {
            str += elem + br;
            return;
        })
        downloadFile('snail-hosts-settings.html', str);
    });

    function downloadFile(fileName, content) {
        let aLink = document.createElement('a');
        let blob = new Blob([content]);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        // aLink.dispatchEvent(evt);
        aLink.click();
    }
});