// This program is to be used with NodeJS run Blockly headless. It loads 
// Blockly XML from `input.xml` and outputs python code on `stdout`.
'use strict';

require('../closure-library/closure/goog/bootstrap/nodejs')
global.Blockly = require('./blockly_uncompressed.js');
require('./blocks_compressed.js');
require('./dart_compressed.js');
require('./javascript_compressed.js');
require('./php_compressed.js');
require('./python_compressed.js');
require('./msg/messages.js');

var fs = require('fs');

var languages = {
    dart: 'Dart',
    javascript: 'JavaScript',
    js: 'JavaScript',
    php: 'PHP',
    python: 'Python',
    py: 'Python'
}

Blockly.JavaScript['text_print'] = function(block) {
  // Print statement. Patch for nodejs that doesn't have alert()
  var argument0 = Blockly.JavaScript.valueToCode(block, 'TEXT',
      Blockly.JavaScript.ORDER_NONE) || '\'\'';
  return 'console.log(' + argument0 + ');\n';
};


var node_blockly = {
    genFromFile: function genFromFile(input_file, language, callback) {
        //the contents of './input.xml' are passed as the `data` parameter
        fs.readFile(input_file, function (err, data) {
            if(err) {
                return callback(err);
            }
            node_blockly.genFromXml(data.toString(), language, callback);
        });
    },
    genFromXml: function genFromXml(xmlText, language, callback) {
        try {
            var xml = Blockly.Xml.textToDom(xmlText);
        } catch (e) {
            return callback(err);
        }
        // Create a headless workspace.
        var workspace = new Blockly.Workspace();
        Blockly.Xml.domToWorkspace(workspace, xml);
        var lang = languages[language.toLowerCase()];
        if(!lang) {
            return callback(new Error('No generator found for '+language));
        }
        var code = Blockly[lang].workspaceToCode(workspace);
        return callback(null, code);
    }
};

module.exports = node_blockly;
