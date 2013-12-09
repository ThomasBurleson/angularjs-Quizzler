/**
 *  Use aysnc script loader, configure the application module (for AngularJS)
 *  and initialize the application ( which configures routing )
 *
 *  @author Thomas Burleson
 */

 (function( window, head ) {
    "use strict";

    head.js(

      // Pre-load these for splash-screen progress bar...

      { angular    : "../vendor/angular/angular.js",                    size: "551057"  },
      { ngRoute    : "../vendor/angular-route/angular-route.js",        size: "30052"   },

      { ngSanitize : "../vendor/angular-sanitize/angular-sanitize.js",  size: "19990"   },

      { require    : "../vendor/requirejs/require.js",                  size: "80196"   },
      { underscore : "../vendor/underscore/underscore.js",              size: "43568"   }

    )
    .ready("ALL", function() {

        require.config (
        {
            appDir  : '',
            baseUrl : '/src',
            priority: 'angular',
            paths   :
            {
                'text'         : '../vendor/_custom/require/text',
                'angular'      : '../vendor/angular/angular',
                'ngRoute'      : '../vendor/angular-route/angular-route',
                'ngSanitize'   : '../vendor/angular-sanitize/angular-sanitize',

                // Configure alias to full paths

                'auth'         : './quizzer/authentication',
                'quiz'         : './quizzer/quiz',
                'utils'        : './mindspace/utils'

            },
            shim    :
            {
                'angular':
                {
                    exports : 'angular',
                    deps    : [  ]
                },
                'underscore':
                {
                    exports : '_'
                }
            }
        });


        /**
         * Specify main application dependencies...
         * one of which is the Authentication module.
         *
         * @type {Array}
         */
        var dependencies = [
                'utils/logger/ExternalLogger',
                'utils/logger/LogDecorator',
                'auth/AuthenticateModule',
                'quiz/RouteManager',
                'quiz/QuizModule'
            ],

            appName = 'quizzer.OnlineTest';

        /**
         * Now let's start our AngularJS app...
         * which uses RequireJS to load  packages and code
         *
         */
        require( dependencies, function ( $log, LogDecorator, AuthenticateModule, RouteManager, QuizModule )
        {
            $log = $log.getInstance( "BOOTSTRAP" );
            $log.debug( "Initializing {0}", [ appName ] );

            /**
             * Start the main application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            angular
                .module(
                    appName,
                    [ "ngRoute", "ngSanitize", AuthenticateModule, QuizModule ]
                )
                .config( LogDecorator  )
                .config( RouteManager  );

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

        });

    });



}( window, head ));
