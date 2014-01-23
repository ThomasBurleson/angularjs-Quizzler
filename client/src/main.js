/**
 * Now let's start our AngularJS app...
 * which uses RequireJS to load  packages and code
 *
 */
(function ( define ) {
    "use strict";

    define([
            'utils/logger/ExternalLogger',
            'utils/logger/LogDecorator',
            'auth/AuthenticateModule',
            'quiz/RouteManager',
            'quiz/QuizModule'
        ],
        function ( $log, LogDecorator, AuthenticateModule, RouteManager, QuizModule )
        {
            /**
             * Specify main application dependencies...
             * one of which is the Authentication module.
             *
             * @type {Array}
             */
            var app, appName = 'quizzer.OnlineTest';

            $log = $log.getInstance( "BOOTSTRAP" );
            $log.debug( "Initializing {0}", [ appName ] );

            /**
             * Start the main application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            app = angular
                    .module(
                        appName,
                        [ "ngRoute", "ngSanitize", AuthenticateModule, QuizModule ]
                    )
                    .config( LogDecorator  )
                    .config( RouteManager  );

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

            return app;
        }
    );

}( define ));
