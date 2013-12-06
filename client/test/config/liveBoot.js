/**
 *
 *  Jasmine boot.js for browser runners
 *
 *  Exposes external/global interface, builds the Jasmine environment and executes it.
 *
 *
 *
 */
(function( jasmine, requirejs ) {
        "use strict";

    var jasmineEnv       = null,
        configureJasmine = function ()
        {
            var htmlReporter = new jasmine.HtmlReporter(),
                jasmineEnv   = jasmine.getEnv(),
                filterFn     = function (spec)
                {
                    return htmlReporter.specFilter(spec);
                };

            jasmineEnv.VERBOSE        = true;
            jasmineEnv.updateInterval = 1000;
            jasmineEnv.specFilter     = filterFn;
            jasmineEnv.addReporter(htmlReporter);

            return jasmineEnv;
        };


  // ****************************************************
  // Prepare the onLoad interceptor
  // ****************************************************

    /**
     * Head hook our window `onload` handler to start the
     * requireJS bootstrap...
     */
    window.onload = (function( handler )
    {
        var interceptor = function()
            {
              if ( handler ) handler();
              startRequireJS();
            };

        jasmineEnv = configureJasmine( jasmine);

        return interceptor;

    })( window.onload );


  // ****************************************************
  // Startup with RequireJS
  // ****************************************************

    function startRequireJS ()
    {

        requirejs.config({

            baseUrl: '/src',

            paths: {

                'jquery'    : '../vendor/jquery/jquery.min',
                'angular'   : '../vendor/angular/angular',

                // Special library to run AngularJS Jasmine tests with LIVE $http

                'live'      : '/test/spec/live',

                // Special RequireJS plugin for "text!..." usages

                'text'      : '../vendor/_custom/require/text'
            },

            shim: {
                'angular':
                {
                    exports : 'angular',
                    deps    : [ 'jquery' ]
                }
            },

            priority: 'angular'
        });


        // Manually specify all the Spec Test files...

        var dependencies = [
            'angular',
            'quizzer/modules/DataServices',
            'live/dataservices/delegates/AuthenticationDelegateSpec'
        ];


        /**
         * Load all the Specs and then start the bootstrap engine...
         */
        require( dependencies , function( angular, DataServices ) {

            // Prepare `test` module for all the specs (if needed)
            // Provide contextRoot for all `live` delegate testing

            angular.module('test.quizzer.Dataservices',   [ DataServices ])
                   .value( "contextRoot", "http://166.78.24.115:8080/app/api/");

            // auto start test runner, once Require.js is done
            jasmineEnv.execute();

        });

    }



}( jasmine, requirejs ));
