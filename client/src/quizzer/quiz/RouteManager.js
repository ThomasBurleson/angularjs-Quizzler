
/**
 * ******************************************************************************************************
 *
 *   QuizModule
 *
 *   Defines controllers and services for the Online Quiz
 *
 *  @author     Thomas Burleson
 *  @date       December 2013
 *
 * ******************************************************************************************************
 */

(function ( define ) {
    "use strict";


    define([
            'utils/logger/ExternalLogger',
            'auth/LoginController',
            'quiz/controllers/TestController',
            'quiz/controllers/ScoreController'
        ],
        function ( $log, LoginController, TestController, ScoreController )
        {
                /**
                 * Route management constructor ()
                 * - to be used in angular.config()
                 *
                 * @see bootstrap.js
                 */
            var RouteManager = function ( $routeProvider )
            {
                $log.debug( "Configuring $routeProvider...");

                $routeProvider
                    .when( '/login', {
                        templateUrl : "./assets/views/login.tpl.html",
                        controller  : "LoginController"
                    })
                    .when( '/quiz/:question?', {
                        templateUrl : "./assets/views/quiz.tpl.html",
                        controller  : "TestController"
                    })
                    .when( '/scoring', {
                        templateUrl : "./assets/views/score.tpl.html",
                        controller  : "ScoreController"
                    })
                    .otherwise({
                        redirectTo  : '/login'
                    });

            };

            $log = $log.getInstance( "RouteManager" );

            return ["$routeProvider", RouteManager ];
        });


}( define ));
