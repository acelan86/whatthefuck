var page = require('webpage').create(),
    system = require('system'),
    address;
var data = {};

if (system.args.length === 1) {
    console.log('Usage: netlog.js <some URL>');
    phantom.exit(1);
} else {
    address = system.args[1],
    wait = system.args[2] || 2;

    page.onResourceRequested = function (request) {
        //console.log('requested: ' + JSON.stringify(request, undefined));
    };

    page.onResourceReceived = function (res, err) {
        data[res.url] = data[res.url] || {};
        data[res.url][res.stage] = {
            status : res.status,
            time : res.time
        };
    };

    page.onError = function(msg, trace) {
        //console.log(msg);
    };
    page.onConsoleMessage = function () {
    };

    page.open(address, function (status) {
        window.setTimeout(function () {
            console.log(JSON.stringify(data));
            phantom.exit();
        }, wait * 1000);
    });
}