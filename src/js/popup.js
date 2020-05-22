
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


    // hosts open/close
    $('#tbody-hosts').on('click', 'tr', function (e) {
        let host = model.getHostById($(this).data('id')),
            enableHost = host.status != 1 ? true : false;
        if (enableHost == true) {
            let enablesHosts = model.getEnabledHosts();
            let anotherIds = [];
            for (let i = 0, len = enablesHosts.length; i < len; i++) {
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