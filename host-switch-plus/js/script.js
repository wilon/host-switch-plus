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
    switch(request.req){
        case "showip":{
            var hosts = request.hosts,
                _url = getDomain(request.url);
            var style = 'position:fixed;bottom:0;left:0;z-index:99999;padding:3px 5px;background:rgba(0,0,0,.3);color:#FFF;font-size:12px;border-radius:0 3px 0 0;';
            for( var i = 0, len = hosts.length; i < len; i++ ){
                var host = hosts[i];
                if( host.domain === '*' || (host.domain.indexOf('*') > -1 ? (new RegExp('^'+ host.domain.split('.').join('\\.').split('*').join('.*') +'$')).test(_url) : host.domain === _url) ){
                    jQuery('body').append('<div class="hsp-ipview" title="Added By Host Switch Plus ( '+ host.ip +' '+ host.domain +' )" style="'+ style +'">'+ host.ip +'</div>');
                    console.info("Host Switch Plus: " + new Date().Format("hh:mm:ss") + " - " + getDomain(request.url) + '=>' + request.ip + ' ||| ( '+ host.ip +' '+ host.domain +' )');
                    break;
                }
            }
        }

        default:{
        }
    }
    sendResponse({});
});
