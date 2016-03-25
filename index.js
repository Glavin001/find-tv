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
//    async.filter(allIPs, function(ip, callback) {
//    async.detect(allIPs, function(ip, callback) {
    async.detectLimit(allIPs, limit, function(ip, callback) {
        //console.log('Check '+ip+' '+(+new Date()));
        var remote = new SamsungRemote({
            ip: ip, // required: IP address of your Samsung Smart TV 
            timeout: timeout
        });
        // check if TV is alive (ping) 
        return remote.isAlive(function(err) {
            //console.log('Done1 '+ip+' '+(+new Date()));
            if (!err) {
                return remote.send('KEY_POWERON', function(err) {
                    //console.log('Done2 '+ip+' '+(+new Date()));
                    return callback(null, !err);
                });
            } else {
                return callback(null, false);
            }
        });
    }, function(error, results) {
        //console.log(error, results); 
        return callback(error, results);
    });

}
