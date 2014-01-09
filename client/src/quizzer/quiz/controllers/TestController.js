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

    /**
     * Register the TestController class with RequireJS
     */
    define( [ 'utils/supplant' ], function ( supplant )
    {
        var VIEW_QUESTION = "/quiz/{index}",
            VIEW_SCORING  = "/scoring",
            ANSWER_NEEDED = "Before you can continue, please select your answer!",

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
            TestController = function( $scope, session, quizDelegate, $location, $routeParams, $log, $window )
            {
                $log = $log.getInstance( "TestController" );
                $log.debug( "constructor() ");

                var quiz = session.quiz,
                    /**
                     * Navigate to and display the next question
                     */
                    nextQuestion = function()
                    {
                        var question = null,
                            url      = "";

                        $log.debug( "nextQuestion( )" );

                        // Fail if the user did NOT select an answer ?

                        if ( $scope.challenge && ($scope.challenge.selected === undefined) )
                        {
                            $log.warn( ANSWER_NEEDED );
                            $window.alert( ANSWER_NEEDED );
                            return;
                        }

                        // Lookup the next question to build and navigate to the URL

                        question = quiz.nextQuestion();
                        url      = supplant( VIEW_QUESTION, question );

                        $log.debug( "Navigating to the '{0}' view...", [ url ] );
                        $location.path( url );

                    },
                    /**
                     * Submit the quiz and answers and build the test score details
                     */
                    submitTest = function()
                    {
                        $log.debug( "submitTest()" );

                        $log.tryCatch( function()
                        {
                            return quizDelegate
                                    .submitQuiz( quiz )
                                    .then( function( score )
                                    {
                                       // Cache score information for use by ScoreController
                                       // Navigate to `Score Results` view

                                       $log.debug( supplant("onResult_submitTest( Test Score = {totalScore} )", [score] ));

                                       session.score = score;
                                       session.quiz  = null;

                                       $log.debug( "Navigating to the '/scoring' view..." );
                                       $location.path( VIEW_SCORING );

                                    });
                        });

                    },
                    /**
                     * Auto-load the quiz and prepare to show the first question...
                     */
                    loadQuiz = function( quizID )
                    {
                        $log.debug( supplant( "loadQuiz( quiz ID = {0} )", [ quizID ] ));

                        $log.tryCatch( function()
                        {
                            // Load the quiz and save to the session cache
                            // NOTE: do not publish the entire `quiz` to scope... to much visibility

                            return quizDelegate
                                    .loadQuiz( quizID )
                                    .then( function( instance )
                                    {
                                        $log.debug( supplant( "onResult_loadQuiz( quizID = {0} )", [ instance.uid ] ));

                                        // Save the quiz to the session cache
                                        session.quiz    = quiz = instance;
                                        $scope.quizName = quiz.name;

                                        nextQuestion();
                                    });
                        });
                    },

                    /**
                     * Do we already have the question loaded `into` the view ?
                     * @param qIndex Integer index of the question if the questions list
                     * @returns {*|boolean}
                     */
                    questionAlreadyLoaded = function( qIndex )
                    {
                        return $scope.challenge && ($scope.challenge.index === qIndex );
                    },

                    /**
                     * Check if specific question is `bookmarked` and should be loaded immediately
                     *
                     */
                    loadBookMarkedQuestion = function( qIndex )
                    {
                        var question = null;

                        // Use specified index or default to 1st question

                        qIndex = qIndex || $routeParams.question || 1;

                        $scope.next      = nextQuestion;
                        $scope.btnTitle  = "Continue";

                        // If we can lookup a question in the quiz, find that question and publish to $scope ?

                        if ( quiz && angular.isDefined( qIndex ) && !questionAlreadyLoaded( qIndex ) )
                        {
                            $log.debug( "loadBookMarkedQuestion( index = {0} )", [ qIndex ] );

                            question = quiz.seekQuestion( qIndex );

                            $log.debug( " current question = {index} ", question );

                            // The last question will `submit` the quiz answers...

                            $scope.next     = quiz.hasNext() ? nextQuestion : submitTest;
                            $scope.btnTitle = quiz.hasNext() ? "Continue"   : "Submit";
                        }

                        return question;
                    };


                // Load selected quiz and configure presentation model
                // data for view consumption

                if ( session.sessionID && ( !quiz || quiz.uid != session.selectedQuiz ) )
                {
                    loadQuiz( session.selectedQuiz );
                }


                $scope.quizName  = quiz ? quiz.name : "";
                $scope.challenge = loadBookMarkedQuestion();

            };

        // Register as global constructor function

        return [ "$scope", "session", "quizDelegate", "$location", "$routeParams", "$log", "$window",  TestController ];

    });


}( define ));
