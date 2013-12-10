/**
 * Jasmine-As-Promised
 *
 * Based on Domenic's promise solution for Mocha, here are runtime extensions to support
 * Promises for the Jasmine Spec functionality.
 *
 * Currently the Spec::runs(<fn>) function will execute the target function synchronously.
 * If the developer has an async function, then the developer must subsequently invoke waitsFor()
 * to watch a latch variable before further tests are performed.
 *
 * If the <fn> target function returns a promise, this extension silently performs all the setup
 * required to pause Spec tests until the function resolves/rejects or times out.
 *
 * Consider the scenario below where authenticator.login() is an async function that returns a promise:
 *
 * <pre>
 *
 *    it( "invalid password returns failed login() response", inject( function( authenticator )
 *    {
 *        var userName  = "ThomasBurleson",
 *            password  = "validPassword",
 *            response  = null;
 *
 *
 *        // Perform Live, async call and test/expect results...
 *
 *        // ********************
 *        // Approach #1
 *        // ********************
 *
 *        runs( function runFn()
 *        {
 *            return authenticator
 *                    .login( userName, password )
 *                    .then( function( response )
 *                    {
 *                      expect( response ).toBe( false );
 *                    });
 *        });
 *
 *        // ********************
 *        // Approach #2
 *        // ********************
 *
 *        runs(
 *           function runFn()
 *           {
 *              return authenticator.login( userName,  password );
 *           },
 *           function expectFn( response )
 *           {
 *              expect( response ).toBe( false );
 *           }
 *        );
 *
 *    }));
 *
 * </pre>
 *
 *
 * @author Thomas Burleson
 * @author Domenic Denicola
 *
 * @website https://github.com/Mindspace/jasmine-as-promised
 * @website https://github.com/domenic/mocha-as-promised
 *
 * @date September, 2013
 *
 *
 */
(function (window) {
    "use strict";

    var isDefined = function ( x )
        {
            return (x !== null) && (typeof x !== 'undefined');
        },
        isFunction = function ( x )
        {
            return isDefined( x ) && typeof x === 'function';
        },
        isObject = function ( x )
        {
            return isDefined( x ) && (typeof x === 'object' );
        },
        isPromise = function( x )
        {
            return isObject( x ) && isFunction( x.then );
        },
        findNodeJSTarget = function (moduleToTest, suffix)
        {
            if (moduleToTest.id.indexOf(suffix, moduleToTest.id.length - suffix.length) !== -1 && moduleToTest.exports) {
                return moduleToTest.exports;
            }

            for ( var i = 0; i < moduleToTest.children.length; ++i )
            {
                var found = findNodeJSTarget(moduleToTest.children[i], suffix);

                if (found) {
                    return found;
                }
            }
        },

        /**
         * Have we already decoratored the original behavior ?
         */
        duckPunchedAlready = false,

        /**
         *  jasmineAsPromised() functionality
         *
         */
        jasmineAsPromised = function (jasmine)
        {
            var response = null,
                runs     = jasmine ? jasmine.Spec.prototype.runs     : null,
                waitsFor = jasmine ? jasmine.Spec.prototype.waitsFor : null,

            /**
             * runs() Interceptor to support promise arguments (instead of functions())
             *
             * @param target Function or Promise instance
             * @param timeout Optional #mSecs before the waitsFor() timesout
             */
            interceptor = function ( runFn, expectFn, timeOut )
            {
                var result         = false,
                    onReleaseWait  = function( data )
                    {
                        // cache for subsequent use (outside promise context)
                        // Update to `true` when the promise resolves/rejects

                        response = data;
                        result   = true;

                        return data;
                    };


                // (1) Perform the async all; which MUST return a promise

                runs.call( this, function()
                {
                    var retVal = runFn.call( this );

                    if ( isPromise( retVal ) )
                    {
                        /**
                         * Are we using angular.mocks; where we must manually flush any
                         * pending promise handlers ?
                         */

                        if ( isDefined( window.inject ))
                        {
                            inject( function( $browser )
                            {
                                retVal.then( onReleaseWait, onReleaseWait );

                                try {

                                    $browser.defer.flush();

                                } catch( e ) {  }
                            });

                        } else {

                            retVal.then( onReleaseWait, onReleaseWait );
                        }

                    } else {

                        // Immediately release the watcher...
                        onReleaseWait( retVal );
                    }

                });


                // (2) Pauses until async action responds

                waitsFor.call( this, function()
                {
                    // Waits until `true`
                    return result;

                }, timeOut );


                // (3) Finally check the `expected`s - OPTIONAL

                runs.call( this, function()
                {
                    if ( isDefined( expectFn ) )
                    {
                        // Forward promise response/fault to expectFn handler (if desired)

                        expectFn.call( this, (expectFn.length == 1) ? [ response ] : [ ] );
                    }
                });
            };


            if ( !duckPunchedAlready && isDefined(jasmine) )
            {
                duckPunchedAlready = true;

                // Intercept global to support expectFn arguments

                if ( isDefined(window) )
                {
                    // Publish global runs() functionality...

                    window.runs = function( runFn, expectFn, timeOut )
                    {
                        var context = jasmine.getEnv().currentSpec;
                        interceptor.apply( context, [ runFn, expectFn, timeOut ]);
                    };
                }
            }
        };

    // *******************************
    // Module systems magic dance.
    // *******************************

    if ( typeof require === "function" && typeof exports === "object" && typeof module === "object" )
    {
        // Node.js: plug in automatically, if no argument is provided. This is a good idea since one can run Jasmine tests
        // using the Jasmine test runner from either a locally-installed package, or from a globally-installed one.
        // In the latter case, naively plugging in `require("jasmine")` would end up duck-punching the wrong instance,
        // so we provide this shortcut to auto-detect which Jasmine package needs to be duck-punched.

        module.exports = function (target)
        {
            if ( !target )
            {
                if ( isObject(process) && Object.prototype.toString.call(process) === "[object process]")
                {
                    // We're in *real* Node.js, not in a browserify-like environment. Do automatic detection logic.

                    // Funky syntax prevents Browserify from detecting the require, since it's needed for Node.js-only stuff.
                    var path = (require)("path");
                    var suffix = path.join("jasmine", "lib", "jasmine.js");
                    target = findNodeJSTarget(require.main, suffix);

                    if ( !isDefined(target) )
                    {
                        throw new Error("Attempted to automatically plug in to Jasmine, but could not detect a " +
                            "running Jasmine module.");
                    }

                } else if ( isDefined(jasmine) ) {

                    // We're in a browserify-like emulation environment. Try the `jasmine` global.
                    target = jasmine;

                } else {

                    throw new Error("Attempted to automatically plug in to Jasmine, but could not detect the " +
                        "environment. Plug in manually by passing the running Jasmine module.");
                }
            }

            jasmineAsPromised(target);
        };

    } else if ( !isDefined(jasmine) && isFunction(define) && isDefined(define.amd) ) {
        // AMD
        define(function () {
            return jasmineAsPromised;
        });
    } else if ( isDefined(jasmine) ) {
        // Other environment (usually <script> tag): plug in global `jasmine` directly and automatically.
        jasmineAsPromised(jasmine);
    }

}(window));