/**
 *
 * Click chrome button.
 *
 * @author by wilon <github.com/wilon>
 *
 */
$(function() {

    window.Table = {};

    // Search
    $('#search-input').on('keyup', function() {
        var kw = $(this).val();
        clearTimeout($(this).data('t'));
        $(this).data('t', setTimeout(function() {
            window.Table.search(kw);
        }, 100));
    });

    // Change Tag
    $(document).on('click', '#tags-filter a', function() {
        var tag = $(this).data('tag') || '';
        $('#search-input').val(tag);
        window.Table.search(tag);
    });
    $('#tags-filter').on('dblclick', 'a', function() {
        var tag = $(this).data('tag') || '';
        window.Table.search(tag);
    });

    window.Table.search = function (kw) {
        kw = kw || '';
        _loadTags(kw);
        _loadDomainList(kw);
    }

    function _loadTags(kw) {
        var tags = window.Model.countTags();
        var total = 0;
        var tagsHml = '',
            label_checks = '',
            actionAll = true;
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if( ! tag.count ) continue;
            if( ! tag.name ) continue;
            total += tag.count;
            var taga = $("<a/>")
                .append(tag.name + '(' + tag.count + ')')
                .attr('href', '#')
                .attr('data-tag', tag.name)
            if (kw == tag.name) {
                taga.addClass('action');
                actionAll = false;
            }
            tagsHml += taga.prop('outerHTML');
            label_checks += '<label class="checkbox"><input type="checkbox" name="labels[]" value="' + tag.name + '">' + tag.name + '</label>';

        }
        var tagAll = $("<a/>")
            .append('All(' + total + ')')
            .attr('href', '#')
            .attr('data-tag', '');
        if (actionAll == true) {
            tagAll.addClass('action');
        }
        $('#tags-filter').html(tagAll.prop('outerHTML') + tagsHml);
        $('#div_labels').html(label_checks);
    }

    function _loadDomainList(kw) {
        var result = window.Model.search(kw);
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

    window.Table.changeHostStatus = function (ids, status) {
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
            window.Model.enableHosts(ids);
        } else {
            window.Model.disableHosts(ids);
        }
        return;
    }
});