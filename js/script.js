/**
 *
 * Load page console.
 *
 * Created by sdm on 14-1-24.
 * Editor by wilon on 15-04-16
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    var style = 'display: block; position: fixed; bottom: 3px; color: rgb(51, 51, 51); cursor: default; vertical-align: baseline; user-select: none; z-index: 2147483646; opacity: 1; background: rgb(217, 234, 211) !important; padding: 4px 5px !important; border-width: 1px !important; border-style: solid !important; border-color: rgb(145, 145, 145) !important; border-image: initial !important; font: 12px/1.1 "Microsoft YaHei", Arial, Helvetica, sans-serif !important; outline: 0px !important; margin: 0px !important;';
    var body = document.body;
    var div = document.createElement("div");
    div.id = "snail-hosts-ipview";
    div.innerHTML = request.ip;
    div.style.cssText = style;
    document.body.appendChild(div);
    sendResponse({});
});
