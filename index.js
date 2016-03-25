#!/usr/bin/env node

var async = require('async');
var SamsungRemote = require('samsung-remote');
var ip = require('ip');

var allIPs = [];
var myIp = ip.address();
var p = ip.toBuffer(myIp);
var prefix = p[0]+'.'+p[1]+'.'+p[2]+'.';

for (var s2=0; s2<256; s2++) {
    allIPs.push(prefix+s2);
}

module.exports = function(options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    var limit = options.limit || 256;
    var timeout = options.timeout || 100; // milliseconds
    async.detectLimit(allIPs, limit, function(ip, callback) {
        var remote = new SamsungRemote({
            ip: ip, // required: IP address of your Samsung Smart TV 
            timeout: timeout
        });
        // check if TV is alive (ping) 
        return remote.isAlive(function(err) {
            if (!err) {
                return remote.send('KEY_POWERON', function(err) {
                    callback(null, !err);
                    // Handle callback being called multiple times
                    callback = function() {}; 
                });
            } else {
                return callback(null, false);
            }
        });
    }, function(error, results) {
        return callback(error, results);
    });

}
