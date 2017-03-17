var enableHosts = [];

chrome.webRequest.onCompleted.addListener(function (details) {
    setTimeout(function(){
        details.req = 'showip';
        details.hosts = enableHosts;
        chrome.tabs.sendRequest(details.tabId, details, function (response) {
        });
    }, 1000);
}, {
    urls: [ 'http://*/*', 'https://*/*' ],
    types: [ 'main_frame' ]
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    enableHosts = request;
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var location = localStorage[request.ip] || getIpLocation(request.ip);
    localStorage[request.ip] = location;
    sendResponse({'location': location});
});

function getIpLocation(ip) {
    var location = '';
    http_ajax('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip, 'GET', false, function(data) {
        if (true === data.success) {
            try {
                var loc = JSON.parse(data.content);
                if (loc.ret !== undefined) {
                    if (loc.ret < 0) {
                        location = '';
                    } else if(loc.ret == 1) {
                        location = loc.country + ' ' + loc.province + ' ' + loc.city;
                    }
                }
            } catch(exception) {
            }
        } else {
            location = '';
        }
    });
    return location;
}

function http_ajax(link, method, aysnc, callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var respData;
            if (xhr.status === 200 && xhr.responseText) {
                respData = {
                    success : true,
                    content : xhr.responseText
                };
            } else {
                respData = {
                    success : false,
                    content : "load remote file content failed."
                };
            }
            callback(respData);
        }
    };
    xhr.open(method, link, aysnc);
    xhr.send();
};