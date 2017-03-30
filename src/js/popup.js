
$(function() {

    // Data model
    var model = window.Model;

    // Load domain & tags
    setTimeout(function () {
        var kw = model.getkws()[0] || '';
        $('#search-input').val(kw);
        window.Table.search(kw);
    });

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
            window.Table.changeHostStatus(anotherIds, 0);
        }
        window.Table.changeHostStatus([host.id], enableHost ? 1 : 0);
        return false;
    });

});