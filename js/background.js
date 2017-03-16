chrome.webRequest.onCompleted.addListener(function(details) {
    setTimeout(function() {
        chrome.tabs.sendRequest(details.tabId, details, function(response) {
            console.log('res:', response)
        });
    }, 1000);
}, {
    urls: ['http://*/*', 'https://*/*'],
    types: ['main_frame']
});