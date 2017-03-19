/**
 *
 * Click chrome button.
 *
 * @author by wilon <github.com/wilon>
 *
 */

$(function() {

    // Data model
    var model = window.Model;
    // Lang support
    var lang = new Lang();
    lang.dynamic('zh_CN', '/js/langpack/zh_CN.json');
    lang.init({});
    // Load domain & tags
    setTimeout(reload);

    // Status check
    $("#status").prop('checked', model.getStatus()).change(function() {
        model.setStatus(this.checked);
        var statusDom = $(this).next();
        if (statusDom.text() == lang.translate('On')) {
            statusDom.text(lang.translate('Off'));
        } else {
            statusDom.text(lang.translate('On'));
        }
    });
    // Change Tag
    $('#tags-filter').on('click', 'a', function() {
        var tag = $(this).data('tag') || '';
        reload(tag);
    });
    $('#tags-filter').on('dblclick', 'a', function() {
        var tag = $(this).data('tag') || '';
        reload(tag);
    });
    // Search
    $('#search-input').on('keyup', function() {
        var kw = $(this).val();
        clearTimeout($(this).data('t'));
        $(this).data('t', setTimeout(function() {
            reload();
        }, 100));
    });

    $('#tbody-hosts').on('click', 'tr', function(e) {
        var host = model.getHostById($(this).data('id')),
            enableHost = host.status != 1 ? true : false;
        if (enableHost == true) {
            var enablesHosts = model.getEnabledHosts();
            var anotherIds = [];
            for (var i = 0, len = enablesHosts.length; i < len; i++) {
                if (enablesHosts[i].domain === host.domain) {
                    anotherIds.push(enablesHosts[i].id);
                }
            };
            changeHostStatus(anotherIds, 0);
        }
        changeHostStatus([host.id], enableHost ? 1 : 0);
        return false;
    });

    function reload(kw = null) {
        if (kw === null) {
            kw = $('#search-input').val();
        } else {
            $('#search-input').val(kw);
        }
        kw = kw || '';
        loadTags(kw);
        loadDomainList(kw);
    }

    function loadTags(kw = '') {
        var tags = model.countTags();
        var total = 0;
        var tagsHml = '',
            actionAll = true;
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if( ! tag.count ) continue;
            total += tag.count;
            if( ! tag.name ) continue;
            var taga = $("<a/>")
                .append(tag.name + '(' + tag.count + ')')
                .attr('href', '#')
                .attr('data-tag', tag.name)
            if (kw == tag.name) {
                taga.addClass('action');
                actionAll = false;
            }
            tagsHml += taga.prop('outerHTML');
        }
        var tagAll = $("<a/>")
            .append('All(' + tag.count + ')')
            .attr('href', '#')
            .attr('data-tag', tag.name);
        if (actionAll == true) {
            tagAll.addClass('action');
        }
        $('#tags-filter').html(tagAll.prop('outerHTML') + tagsHml);
    }

    function loadDomainList(kw = '') {
        var result = model.search(kw);
        var tbody = $('#tbody-hosts'),
            html = '';
        if (result.length == 0) {
            html = '<tr><td colspan="6">'+lang.translate('No Results')+'</td></tr>';
        } else {
            $(result).each(function(i, v) {
                v.tags = v.tags ? (v.tags.join(', ')) : '';
                v.status_class = v.status ? 'status-enabled' : 'status-disabled';
            });
            html = $('#host-item').extendObj(result);
        }
        tbody.html(html);
    }

    function changeHostStatus(ids, status) {
        var id_map = {},
            enableHost = status != 0 ? true : false;
        $(ids).each(function(i, v) {
            id_map[v] = 1;
            var span = $('#tbody-hosts tr#host-' + v).find('.host-status');
            if (enableHost == true) {
                span.removeClass('status-disabled').addClass('status-enabled');
            } else {
                span.removeClass('status-enabled').addClass('status-disabled');
            }
            span.data('status', status ? 1 : 0);
        });
        if (enableHost == true) {
            model.enableHosts(ids);
        } else {
            model.disableHosts(ids);
        }
        return;
    }
})

