/**
 *
 * Load page IP info.
 *
 * @author wilon <github.com/wilon>
 *
 * @Thanks To https://chrome.google.com/webstore/detail/the-ip/ehaiielehjkjaofolpmdmcjgffbeicck
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // Append div
    var style = 'display: block; position: fixed; bottom: 3px; color: rgb(51, 51, 51); cursor: default; vertical-align: baseline; user-select: none; z-index: 2147483646; opacity: 1; background: rgb(217, 234, 211) !important; padding: 4px 5px !important; border-width: 1px !important; border-style: solid !important; border-color: rgb(145, 145, 145) !important; border-image: initial !important; font: 12px/1.1 "Microsoft YaHei", Arial, Helvetica, sans-serif !important; outline: 0px !important; margin: 0px !important;right:10px;';
    var divDom = document.createElement("div");
    divDom.id = "snail-hosts-ipview";
    divDom.style.cssText = style;
    divDom.innerHTML = request.ip
    // Get location
    chrome.extension.sendMessage({
        'ip': request.ip
    }, function(response) {
        divDom.innerHTML += '<br>' + response.location;
    });
    document.body.appendChild(divDom);
    // On mouseover
    divDom.onmouseover = function() {
        var ipView = document.getElementById('snail-hosts-ipview');
        if (ipView.style.top !== '10px') {
            ipView.style.top = '10px';
            ipView.style.bottom = '';
        } else {
            ipView.style.bottom = '3px';
            ipView.style.top = '';
        }
    };
    sendResponse({});
});


