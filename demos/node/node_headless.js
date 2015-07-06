#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');

var blockly;
try {
    blockly = require('blockly');
} catch(e) {
    blockly = require(__dirname+'/../../app.headless.js');
}



var inputfilename = process.argv[2];
var language = process.argv[3] || 'JavaScript';

if(!inputfilename) {
    console.log("Usage: "+process.argv[1]+" inputFile.xml [output_language]");
    process.exit(0);
}

blockly.genFromFile(inputfilename, language, function(err, code) {
    if(err) {
        console.log(err);
    } else {
        console.log(code);
    }
});

