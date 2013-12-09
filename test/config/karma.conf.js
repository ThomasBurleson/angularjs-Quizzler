/**
 *  NodeJS configuration used for the Karma Server
 *
 *  This code does three (3) things:
 *  1 ) configures NodeJS Karma server with frameworks: Jasmine and RequireJS
 *  2 ) auto-loads the jQuery, AngularJS, and AngularJS Mock libs
 *  3 ) configures paths that should be included in the browser using <script> tag? or loaded them manually, eg. using Require.js.
 *
 *  @see https://github.com/yeoman/generator-angular
 *
 *  @author Thomas Burleson
 *  @blog   www.gridlinked.info
 *
 *  @date   August, 2013
 *
 *
 */
module.exports = function(config)
{

  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../../',

    /**
     *  frameworks to use; by specifying `requirejs` we do not have to manually
     *  load them here in the config
     */
    frameworks: [ 'jasmine', 'requirejs' ],


    // list of files / patterns to load in the Browser (using script tags)
    // @see http://karma-runner.github.io/0.8/config/files.html

    files: [

        // Load these files in this order...

        'vendor/jquery/jquery.min.js',
        'vendor/angular/angular.js',
        'vendor/angular-mocks/angular-mocks.js',
        'vendor/sinon/lib/sinon.js',

        // Use `included = false` to let requireJS load them as needed
        // ... listed here so they can be resolved relative to the baseURL

        { pattern: 'src/quizzer/**/*.js',                 included: false },
        { pattern: 'test/spec/quizzer/**/*Spec.js',       included: false },

        // Load and run the RequireJS/Karma bootstrap
        //
        // NOTE: we do NOT use the application's bootstrap.js since this
        //       custom one will auto-run Karma once loaded.

        'test/config/karmaBoot.js'
    ],

    // list of files to exclude
    exclude: [ 'src/bootstrap.js' ],


      // web server port
      port: 9876,


      // cli runner port
      runnerPort: 9100,

      reporters: [ 'progress', 'dots' ],

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // - process.env.TRAVIS
      browsers: ['ChromeCanary' ],

      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 60000,



    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false


  });
};
