var util = require('util');
var path = require('path');

// Put jasmine in the global context, this is somewhat like running in a
// browser where every file will have access to `jasmine`.
var requireJasmine = require('./jasmine-1.3.1.js');
for (var key in requireJasmine) {
  global[key] = requireJasmine[key];
}

// Overwriting it allows us to handle custom async specs.
global.it = function(desc, func, timeout) {
    return jasmine.getEnv().it(desc, func, timeout);
};
global.beforeEach = function(func, timeout) {
    return jasmine.getEnv().beforeEach(func, timeout);
};
global.afterEach = function(func, timeout) {
    return jasmine.getEnv().afterEach(func, timeout);
};

// Allow async tests by passing in a 'done' function.
require('./async-callback');

// For the terminal reporters.
var nodeReporters = require('./reporter').jasmineNode;
jasmine.TerminalVerboseReporter = nodeReporters.TerminalVerboseReporter;
jasmine.TerminalReporter = nodeReporters.TerminalReporter;

function removeJasmineFrames(text) {
  if (!text) {
    return text;
  }
  var jasmineFilename = __dirname + '/jasmine-1.3.1.js';
  var lines = [];
  text.split(/\n/).forEach(function(line){
    if (line.indexOf(jasmineFilename) == -1) {
      lines.push(line);
    }
  });
  return lines.join('\n');
}

var jasmineEnv = jasmine.getEnv();
var specFiles = [];

/**
 * Add a spec file to the list to be executed. Specs should be relative
 * to the current working dir of the process or absolute.
 * @param {string|Array.<string>} specs
 */
exports.addSpecs = function(specs) {
  if (typeof specs === 'string') {
    specFiles.push(specs);
  } else if (specs.length) {
    for (var i = 0; i < specs.length; ++i) {
      specFiles.push(specs[i]);
    }
  }
};

/**
 * Alias for jasmine.getEnv().addReporter
 */
exports.addReporter = jasmineEnv.addReporter;

/**
 * Execute the loaded specs. Optional options object described below.
 * @param {Object} options
 */
exports.executeSpecs = function(options) {
  options = options || {};
  // An array of filenames, either absolute or relative to current working dir.
  // These will be executed, as well as any tests added with addSpecs()
  var specs = options['specs'] || [];
  // A function to call on completion. function(runner, log)
  var done = options['onComplete'];
  // If true, display spec names 
  var isVerbose = options['isVerbose'];
  // If true, print colors to the terminal 
  var showColors = options['showColors'];
  // If true, include stack traces in failures 
  var includeStackTrace = options['includeStackTrace'];
  // Time to wait in milliseconds before a test automatically fails
  var defaultTimeoutInterval = options['defaultTimeoutInterval'] || 5000;

  if (isVerbose) {
    jasmineEnv.addReporter(new jasmine.TerminalVerboseReporter({
      print:       util.print,
      color:       showColors,
      onComplete:  done,
      stackFilter: removeJasmineFrames}));
  } else {
    jasmineEnv.addReporter(new jasmine.TerminalReporter({
      print:       util.print,
      color: showColors,
      includeStackTrace: includeStackTrace,
      onComplete:  done,
      stackFilter: removeJasmineFrames}));
  }

  jasmineEnv.defaultTimeoutInterval = defaultTimeoutInterval;

  specFiles = specFiles.concat(specs);

  for (var i = 0, len = specFiles.length; i < len; ++i) {
    var filename = specFiles[i];
    // Catch exceptions in loading the spec files.
    try {
      require(path.resolve(process.cwd(), filename));
    } catch (e) {
      console.log("Exception loading: " + filename);
      console.log(e);
    }
  }

  jasmineEnv.execute();
};
