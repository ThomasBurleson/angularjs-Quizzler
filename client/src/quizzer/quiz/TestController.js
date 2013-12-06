/**
 *
 *  This TestController module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
(function( define ) {
    "use strict";

    var dependencies = [ 'utils/supplant' ];

    /**
     * Register the TestController class with RequireJS
     */
    define( dependencies, function ( supplant )
    {
            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
        var TestController = function( $scope, session, quizDelegate, $location, $log )
            {
                $log = $log.getInstance( "TestController" );
                $log.debug( "constructor() ");

                var quiz = session.quiz,
                    nextQuestion = function()
                    {
                        $log.debug( "nextQuestion( )" );

                            $scope.challenge = quiz.nextQuestion();

                            if ( !quiz.hasNext() )
                            {
                                $scope.next     = submitTest;
                                $scope.btnTitle = "Submit";
                            }

                        $log.debug( " current question = {index} ", $scope.challenge );
                    },
                    submitTest = function()
                    {
                        $log.debug( "submitTest()" );

                        $log.tryCatch( function() {
                            quizDelegate
                                .submitQuiz( quiz )
                                .then( function( score )
                                {
                                   // Cache score information for use by ScoreController
                                   // Navigate to `Score Results` view

                                   $log.debug( supplant("onResult_submitTest( Test Score = {totalScore} )", [score] ));
                                   session.score = score;

                                   $log.debug( "Navigating to the '/scoring' view..." );
                                   $location.path( '/scoring' );

                                });
                        });

                    },
                    /**
                     * Auto-load the quiz and prepare to show the first question...
                     */
                    loadQuiz = function( quizID )
                    {
                        $log.debug( supplant( "loadQuiz( quiz ID = {0} )", [ quizID ] ));

                        $log.tryCatch( function() {

                            quizDelegate
                                .loadQuiz( quizID )
                                .then( function( instance )
                                {
                                    session.quiz = quiz = instance;
                                    $log.debug( supplant( "onResult_loadQuiz( quizID = {0} )", [ quiz.uid ] ));

                                    nextQuestion();
                                });
                        });
                    };



                // Load selected quiz and configure presentation model
                // data for view consumption

                if ( session.sessionID && !quiz )
                {
                    loadQuiz( session.selectedQuiz );
                }

                $scope.challenge = null;
                $scope.next      = nextQuestion;
                $scope.btnTitle  = "Continue";

            };

        // Register as global constructor function

        return [ "$scope", "session", "quizDelegate", "$location", "$log", TestController ];

    });


}( define ));
