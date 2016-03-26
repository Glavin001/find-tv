#!/usr/bin/env node
var findTV = require('./index.js');

console.log('Start looking: '+(new Date()));
findTV(function(error, ip) {
    console.log('Stop looking: '+(new Date()));
    console.log('Smart TV', error, ip);
});

