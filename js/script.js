/**
 *
 * Load page console.
 *
 * Created by sdm on 14-1-24.
 * Editor by wilon on 15-04-16
 */

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.info('Host ip: ' + getDomain(request.url) + ' => ' + request.ip);
    sendResponse({});
    function getDomain(url) {
        var t = url.split('://')[1];
        return t.split('/')[0];
    }
});