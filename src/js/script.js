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
    var style = 'display: block;'
            + 'position: fixed;'
            + 'bottom: 3px;'
            + 'color: rgb(51, 51, 51);'
            + 'cursor: default;'
            + 'vertical-align: baseline;'
            + 'user-select: none;'
            + 'z-index: 2147483646;'
            + 'opacity: 1;'
            + 'background: rgb(217, 234, 211) !important;'
            + 'padding: 4px 5px !important;'
            + 'border-width: 1px !important;'
            + 'border-style: solid !important;'
            + 'border-color: rgb(145, 145, 145) !important;'
            + 'border-image: initial !important;'
            + 'font: 12px/1.1 "Microsoft YaHei", Arial, Helvetica, sans-serif !important;'
            + 'outline: 0px !important;'
            + 'margin: 0px !important;'
            + 'right:10px;'
    var divDom = document.createElement("div");
    divDom.id = "snail-hosts-ipview";
    divDom.style.cssText = style;
    divDom.innerHTML = request.ip;
    var ipDom = divDom.innerHTML;
    var interval = function () {}
    var updateDom = function() {
        clearInterval(interval);
        var stockConfig = [
                'sh000001',
                "sh600720",
                "sh601003",
                "sh600368",
                "sh600008",
                "sz000903",
                "sz002024",
                "sz002624",
                "sh600939",
                "sh601633"
            ];
        var stockInfo = [];
        chrome.extension.sendMessage({
            'ip': request.ip,
            'stock': stockConfig
        }, function(response) {
            eval(response.stock.content)
            stockConfig.map(function(elem) {
                var hqStr = 'hq_str_' + elem;
                eval('var info = ' + hqStr + '.split(",")');
                stockInfo.push({
                    name: info[0],
                    code: elem,
                    openPrice: info[2],
                    currPrice: info[3],
                })
            })
            var changeDom = function() {
                var dd = parseInt(Math.random() * stockInfo.length);
                var stock = stockInfo[dd];
                var bai = (stock.currPrice - stock.openPrice) / stock.openPrice * 100;
                var updown = bai > 0 ? '▲' : '▼';
                divDom.innerHTML = ipDom + ' ' + response.location + '<br>'
                    +  stock.name + ' '
                    +  parseFloat(stock.currPrice).toFixed(2) + ' '
                    +  updown + ' '
                    +  parseFloat(bai).toFixed(2) + '%';
                document.body.appendChild(divDom);
            };
            changeDom();
            interval = setInterval(changeDom, 5000);
        });

    }
    updateDom();
    setInterval(updateDom, 15000);
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

