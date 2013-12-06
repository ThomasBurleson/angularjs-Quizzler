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

      { angular    : "../vendor/angular/angular.js",             size: "551057"  },
      { ngRoute    : "../vendor/angular-route/angular-route.js", size: "30052"   },
      { require    : "../vendor/requirejs/require.js",           size: "80196"   },
      { underscore : "../vendor/underscore/underscore.js",       size: "43568"   }


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
                'utils/logger/LogDecorator',
                'auth/AuthenticateModule',
                'quiz/QuizModule'
            ],

            appName = 'quizzer.OnlineTest';

        /**
         * Now let's start our AngularJS app...
         * which uses RequireJS to load  packages and code
         *
         */
        require( dependencies, function ( LogDecorator, AuthenticateModule, QuizModule )
        {
            /**
             * Start the main application
             *
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            angular
                .module( appName,  [ "ngRoute", AuthenticateModule, QuizModule ] )
                .config( LogDecorator )
                .config( function ( $routeProvider, $logProvider )
                {
                    var $log       = $logProvider.$get().getInstance( appName);
                        $log.debug( "Configuring $routeProvider...");

                    $routeProvider
                        .when( '/login', {
                            templateUrl : "/assets/views/login.tpl.html",
                            controller  : "LoginController"
                        })
                        .when( '/quiz', {
                            templateUrl : "/assets/views/quiz.tpl.html",
                            controller  : "TestController"
                        })
                        .when( '/scoring', {
                            templateUrl : "/assets/views/score.tpl.html",
                            controller  : "ScoreController"
                        })
                        .otherwise({
                            redirectTo  : '/login'
                        });

                })

            angular.bootstrap( document.getElementsByTagName("body")[0], [ appName ]);

        });

    });



}( window, head ));
