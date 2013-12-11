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

(function ( define, angular ) {
    "use strict";

    var dependencies = [
        'quiz/delegates/QuizDelegate',
        'quiz/controllers/TestController',
        'quiz/controllers/ScoreController'
    ];

    /**
     *
     *
     */
    define( dependencies, function ( QuizDelegate, TestController, ScoreController )
    {
        var moduleName = "quizzer.Quiz";

        angular.module( moduleName, [ ] )
            .service( "quizDelegate",         QuizDelegate )
            .controller( "TestController",    TestController )
            .controller( "ScoreController",   ScoreController );

        return moduleName;
    });


}( define, angular ));

