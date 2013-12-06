/**
 * ******************************************************************************************************
 *
 *	 QuizModule
 *
 *	 Defines controllers and services for the Authentication Module Quiz
 *
 *  @author     Thomas Burleson
 *  @date       December 2013
 *
 * ******************************************************************************************************
 */

(function ( define, angular ) {
    "use strict";

    var dependencies = [
        'auth/Session',
        'auth/Authenticator',
        'auth/LoginController'
    ];

    /**
     */
    define( dependencies, function ( Session, Authenticator, LoginController )
    {
        var moduleName = "quizzer.Authenticate";

        angular.module( moduleName, [ ] )
            .factory( "session",            Session )
            .service( "authenticator",      Authenticator )
            .controller( "LoginController", LoginController );

        return moduleName;
    });


}( define, angular ));

