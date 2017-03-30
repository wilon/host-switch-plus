/**
 *
 * Setting pages action.
 *
 * Created by sdm on 14-1-18.
 * Updated by Riant at 2015-04-16
 */

$(function() {

    // Data model
    var model = window.Model;

    // Load domain & tags
    setTimeout(function () {
        var kw = model.getkws()[0] || '';
        $('#search-input').val(kw);
        window.Table.search(kw);
    });

    var settingsForm = {
        get: function () {
            return {
                id: Number($('#proxy-id').val()),
                name: $('#proxy-name').val(),
                value: $('#proxy-value').val(),
                ignore: $('#proxy-ignore').val().split('\n'),
            }
        },
        set: function (id, proxy) {
            $('#proxy-id').val(id);
            $('#proxy-name').val(proxy.name);
            $('#proxy-value').val(proxy.value);
            $('#proxy-ignore').val(proxy.ignore.join('\n'));
        },
        reload: function () {
            var proxyData = model.getProxy()
                proxyHtml = ''
            proxyData.map(function(elem, id) {
                var selected = elem.status == 1 ? 'selected' : '';
                proxyHtml += '<option value="'+id+'" '+selected+'>'+elem.name+'</option>'
            });
            $('#proxy').html(proxyHtml);
            var id = $('#proxy').val(),
                proxy = model.getProxy(id)
            if (id > 1) {
                this.set(id, proxy);
            } else {
                this.reset()
            }
        },
        reset: function () {
            this.set('', {
                name: '',
                value: '',
                ignore: [],
            });
        },
        submit: function () {
            var proxy = this.get();
            if (proxy.name == '') {
                formWarning('Please input Proxy Name.');
                return false;
            }
            if (proxy.value == '') {
                formWarning('Please input Proxy Value.');
                return false;
            }
            var id = model.addProxy(proxy);
            $('#proxy').val(id);
            model.changeProxy(id);
            this.reload();
        }
    }

    setTimeout(function(){
        settingsForm.reload();
    })
    $('#proxy').on('change', function() {
        var id = $(this).val();
        model.changeProxy(id);
        settingsForm.reload();
    });
    $('#settings').on('submit', function() {
        settingsForm.submit();
    });


    $('#language').on('change', function() {
        window.lang.change($(this).val());
    });

    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    function formWarning(text) {
        $('.formWarning span').text(text);
        $('.formWarning').slideDown();
        setTimeout(function(){
            $('.formWarning').slideUp();
        }, 3000)
    }

    $('#addForm').on('submit', function() {
        var info = {
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

        var add_tags = $('#add_labels').val().split(',');
        $(add_tags).each(function(i, v) {
            if (v) {
                info.tags.push(v);
            }
        });

        $('#div_labels input[type="checkbox"]:checked').each(function() {
            info.tags.push(this.value);
        });

        model.addHost(info);
        $('#listBtn').trigger('click');
        window.Table.search($('#search-input').val());
        $('#host-'+info.id).addClass('editting');
        return false;
    });

    $('#bulkForm').on('submit', function() {
        var infos = $('#bulkAdd').val().split('\n');
        var rules = /^\s*([^\s]+)\s*([^\s]+)\s*([^\s]+)?\s*([^\s]+)?\s*$/;
        for (var i = 0, len = infos.length; i < len; i++) {
            var info = $.trim(infos[i]);
            if (info.indexOf('#') === 0) {
                continue;
            }
            var info = rules.exec(info);
            if (info.length >= 3) {
                var item = {
                    'ip': $.trim(info[1]),
                    'domain': $.trim(info[2]),
                    'tags': '',
                    'note': $.trim(info[4]) ? $.trim(info[4]) : '',
                    'status': 0,
                    'uptime': new Date().Format("yyyy-MM-dd hh:mm:ss")
                };

                var tags = $.trim(info[3]) ? $.trim(info[3]).split(',') : '';
                if (tags.length) {
                    item.tags = [];
                    $(tags).each(function(i) {
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

    $('#defaultMode').on('submit', function() {
        var mode = $('#input_mode').val(),
            ignore_val = $('#input_ignore').val(),
            ignore_list = ignore_val.split("\n");
        model.setStatus($("#status")[0].checked, mode, ignore_list);
        var res = $('#default option').each(function() {
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

    $('#select_all').change(function() {
        $('#tbody-hosts').find('input[type=checkbox]').prop('checked', this.checked).change();
    });

    $('#tbody-hosts').on('change', 'input', function(e) {
        var tr = $(this).parents('tr');
        if ($(this).prop('checked')) {
            tr.addClass('success');
        } else {
            tr.removeClass('success');
        }
        return false;
    });

    $('#but_del').click(function() {
        $('input[type=checkbox]:checked').each(function() {
            model.removeHost(this.value);
        });
        $('input[type=checkbox]:checked').parents('tr').remove();
        return false;
    });

    $(document).on('click', '.delete', function() {
        if (confirm('Delete Confirm')) {
            var id = $(this).data('id');
            model.removeHost(id);
            $('#host-'+id).remove();
            $('#addForm').reset();
        }
    });


    $(document).on('click', '.edit', function() {
        var id = $(this).data('id');
        var info = model.getHostById(id);
        $('#host-'+id).addClass('editting').siblings().removeClass('editting');
        $('#item-id').val(id);
        $('#ip').val(info.ip);
        $('#domain').val(info.domain);
        $('#div_labels input[type="checkbox"]').attr("checked", false);
        info.tags.map(function(elem) {
            $('#div_labels input[type="checkbox"][value="'+elem+'"]').attr('checked', true)
        })
    })

    $('#add_tab').find('a').on('click', function() {
        var target = $(this).data('target');
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
    $('#export').on('click', function() {
        var hosts = model.getHosts();
        var str = ''
        for (var i in hosts) {
            var h = hosts[i]
            str += h.ip + " " + h.domain + " " + h.tags.toString() + " " + h.note + "\n";
        }
        downloadFile('host-switch-plus.json', str);
    });

    function downloadFile(fileName, content) {
        var aLink = document.createElement('a');
        var blob = new Blob([content]);
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false);
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        // aLink.dispatchEvent(evt);
        aLink.click();
    }
});