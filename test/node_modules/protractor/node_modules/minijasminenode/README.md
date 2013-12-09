minijasminenode
======

Based on Jasmine-Node, but minus the fancy stuff.
This node.js module makes the wonderful Pivotal Lab's jasmine
(http://github.com/pivotal/jasmine) spec framework available in
node.js.

features
--------

MiniJasmineNode exports a library which
- places Jasmine in Node's global namespace, similar to how it's run in a browser
- adds asynchronous testing with done().
- adds result reporters for the terminal.
- adds the ability to load tests from file.

The module also contains a command line wrapper that can be run with

    ./bin/minijl specDir/mySpec1.js specDir/mySpec2.js

For more info on the command line wrapper

    ./bin/minijl --help

installation
------------

Get the library with

    npm install minijasminenode

Or, install globally

    npm install -g minijasminenode

If you install globally, you can use minijasminenode directly from the command line

    minijasminenode mySpecFolder/mySpec.js

usage
-----

```javascript
    var miniJasmineLib = require('minijasminenode');
    // At this point, jasmine is available in the global node context

    // Add your tests by filename.
    miniJasmineLib.addSpecs('myTestFolder/mySpec.js');

    // If you'd like to add a custom Jasmine reporter, you can do so. Tests will
    // be automatically reported to the terminal.
    miniJasmineLib.addReporter(myCustomReporter);

    // Run those tests!
    miniJasmineLib.executeSpecs();
```

You can also pass an options object into `executeSpecs`

````javascript
    var miniJasmineLib = require('minijasminenode');

    var options = {
      // An array of filenames, relative to current dir. These will be
      // executed, as well as any tests added with addSpecs()
      specs: ['specDir/mySpec1.js', 'specDir/mySpec2.js'],
      // A function to call on completion.
      // function(runner, log)
      done: function(runner, log) { util.prints('done!'); },
      // If true, display spec names.
      isVerbose: false,
      // If true, print colors to the terminal.
      showColors: true,
      // If true, include stack traces in failures.
      includeStackTrace: true,
      // Time to wait in milliseconds before a test automatically fails
      defaultTimeoutInterval: 5000
    };
    miniJasmineLib.executeSpecs(options);
````

jasmine
-------

Version 1.3.1 of Jasmine is currently included with node-jasmine.

to run the tests
----------------
`./specs.sh`

This will run passing tests as well as show examples of how failures look. To run only passing tests, use `npm test` or `./bin/minijn spec/*_spec.js`
