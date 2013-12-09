bower-angular-specs
===================

Derivative of angular-mocks. Supports real/live $http XHR requests within Jasmine and Karma tests.

## History 

[Angular-mocks](https://github.com/angular/bower-angular-mocks) is a module of [AngularJS](https://github.com/angular/angularjs) useful with Jasmine unit testing, Karma, and e2e testing... Unfortunately
angular-mocks uses `decorators` to disable real XHR functionality with mock substitutes. This means `$timeout` and `$browser`, 
and `$httpBackend` are all replaced with mock facades.

The impact of the decorator replacements is that developers would not be able to use live/real XHR requests with Jasmine 
Spec test suites. Normally this is the *desired* approach so testing can be performed offline and independent of remote 
server responses. 

## Testing Real remote APIs

There are scenarios, however, when live tests with real remote APIs are important. 

**Live** tests will provide continuous 
testing against the API and continuously validate the expected API, responses, and availability of the server. When the 
server-tier development team in firewalled/partitioned from the client-tier dev team, this testing becomes critically important.

## Usage

Developers **cannot** include `angular-mocks.js` and `angular-specs.js` within the same test suite. Use

*  `angular-mocks` for offline unit testing with mocked services
*  `angular-specs` for online unit testing with real services interacting with remote services

Here is an example of an `AuthenticationDelegate` spec using **mocked** services (with `angular-mocks`):

```javascript
describe("Tests for AuthenticationDelegate ", function () 
{
    describe("testing login() ", function () 
    {
        it( "should returns valid sessionID for valid login", inject(function( authDelegate, $httpBackend )
        {
            var userName  = "ThomasBurleson",
                password  = "triumph",
                sessionID = "12345";

            // Simulate response...

            $httpBackend.when( "POST", urlAuthenticate.LOGIN ).respond({
                status  : "SUCCESS",
                response        : {
                    userName  : userName,
                    sessionID : sessionID
                }
            });

                // Issue request via client-tier dataservice layer
                // which internally uses $http and returns a promise...

                authDelegate
                    .login( userName,  password )
                    .then( function( response )
                    {
                        response = extractData(response);

                        expect( response)            .toBeDefined( );
                        expect( response.sessionID ) .toEqual( "12345" );

                    });

            // Force a response from mock httpBackend

            $httpBackend.flush();

        }));
    });
});
```

Here is an example of an `AuthenticationDelegate` spec using **real** services (with `angular-specs`:

```javascript
describe("Tests for AuthenticationDelegate ", function () 
{
    describe("testing login() ", function () 
    {
        it( "should returns valid sessionID for valid login", inject(function( authDelegate, $httpBackend )
        {
            var userName  = "ThomasBurleson",
                password  = "triumph";

            // Perform Live, async call and test/expect results...
            // Notice the `runs( )` call below manages a Promise 
 
            runs( function ()
            {
                return authDelegate
                        .login( userName,  password )
                        .then(function( response )
                        {
                            expect( response.authToken ).toBeDefined();
                            expect( response.authToken.length).toBeGreaterThan( 0 );
                        });
            });        }));
    });
});
```

A huge feature to notice is that **BOTH** specs use 

```html
    authDelegate.login( <promise handlers> ).then( <expectation checks> ) 
```

to perform the tests. This is critically important... this means that your live testing is usually VERY close in solution to the *mock* test solution(s). This means your maintenance efforts regarding both **mock** test suites and **live** test suites becomes significantly easier.

## Live Features using Jasmine-as-Promised

It is important to note that the `runs( )` method used in the above example triggers a function that returns a Promise.
`runs( )` is a global method published by the Jasmine library... but that method has been *enhanced* to support Promise(s).

This enchancement to `runs()` is achieved by included [Jasmine-as-Promised](https://github.com/Mindspace/jasmine-as-promised) within your tests. 
See the Jasmine-as-Promised [ReadMe](https://github.com/Mindspace/jasmine-as-promised/blob/master/README.md) for details.

## Installation

From a console window, simple use the command

```js
bower install angular-specs
```

This will install **both** the angular-specs library and the jasmine-as-promised library. Then include those scripts in your test runner.

Here is an example Jasmein Test Runner

```html
<html>
    <head>

      <title>Jasmine Spec Runner v2.0.0-rc2 with RequireJS</title>

      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <link rel="shortcut icon" type="image/png" href="../vendor/jasmine/images/jasmine_favicon.png">
      <link rel="stylesheet" type="text/css"     href="../vendor/jasmine/lib/jasmine-core/jasmine.css">

      <!--
          Core Libraries - RequireJS, Jasmine, and AngularJS
      -->
      <script type="text/javascript" src="../vendor/requirejs/require.js"></script>
      <script type="text/javascript" src="../vendor/jasmine/lib/jasmine-core/jasmine.js"></script>
      <script type="text/javascript" src="../vendor/jasmine-as-promised/jasmine-as-promised.js"></script>
      <script type="text/javascript" src="../vendor/angular/angular.js"></script>


      <!--
          1) Special Angular wrapper to support spec `module` and `inject` fuctions for LIVE $http calls...
          2) Dynamic HTML Builder for Jasmine test reporting

          Then configure Jasmine and RequireJS... then start the tests
      -->
      <script type="text/javascript" src="../vendor/angular-specs/angular-specs.js"></script>
      <script type="text/javascript" src="../vendor/jasmine/lib/jasmine-core/jasmine-html.js"></script>

      <!-- 
          Bootstrap code to 

            1) configure the requireJS dependencies, 
            2) configure Jasmine env, and 
            3) prepare angularJS
      -->
      <script type="text/javascript" src="config/liveBoot.js"></script>

    </head>

    <body> </body>

</html>
```


And finally here is a sample `liveBoot.js` code:

```js
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

            baseUrl: '/src/javascript',

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
            'stockpile/dataservices/DataServicesModule',
            'live/dataservices/delegates/AuthenticationDelegateSpec'
        ];


        /**
         * Load all the Specs and then start the bootstrap engine...
         */
        require( dependencies , function( angular, DataServicesModule ) {

            // Prepare `test` module for all the specs (if needed)
            // Provide contextRoot for all `live` delegate testing

            angular.module('test.stockpile.Dataservices',   [ DataServicesModule ])
                   .value( "contextRoot", "http://166.78.24.115:8080/app/api/");

            // auto start test runner, once Require.js is done
            jasmineEnv.execute();

        });

    }

}( jasmine, requirejs ));
```

Because we loaded `angular-spec.js` in our html file **and** we configured RequireJS to load the 
live unit tests (see `live/dataservices/delegates/AuthenticationDelegateSpec` ), we can now easily test 1..n
test suites each with live testing of remote APIs.

