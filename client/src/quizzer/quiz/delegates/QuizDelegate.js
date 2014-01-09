/**
 * ******************************************************************************************************
 *
 *   QuizDelegate
 *
 *   Data service proxy to QuizDelegate API that loads Quiz JSON data and builds quiz instances
 *
 *  @author     Thomas Burleson
 *  @date       December, 2013
 *
 *
 * ******************************************************************************************************
 */
(function ( define ) {
    "use strict";

    var QUIZ_TEMPLATE = "./assets/data/quiz_{id}.json";

        define([
            'utils/supplant',
            'utils/Factory',
            'quiz/builders/QuizBuilder',
            'quiz/builders/ScoreBuilder'
        ],
        function ( supplant, Factory, QuizBuilder, ScoreBuilder )
        {
                /**
                 * Builder used to create Quiz instance from JSON data
                 * @type {Quiz}
                 */
            var quizBuilder  = Factory.instanceOf( QuizBuilder  ),
                /**
                 * Builder used to create Score instances from a specified Quiz instance
                 * @type {Score}
                 */
                scoreBuilder = Factory.instanceOf( ScoreBuilder),

                /**
                 * QuizDelegat
                 * @constructor
                 */
                QuizDelegate = function ( $http, $q, $log )
                {
                   $log = $log.getInstance( "QuizDelegate" );

                        /**
                         * Util function to build a resolved promise;
                         * ...resolved with specified value
                         *
                         * @returns {promise|*|promise}
                         */
                    var makeResolved = function( response )
                        {
                            var dfd = $q.defer();
                                dfd.resolve( response );

                            return dfd.promise;
                        },

                        /**
                         * Load Quiz questions/choices/answers data
                         *
                         * @param quizID is the Quiz ID that should be loaded
                         * @return Promise
                         */
                        loadByID = function( quizID )
                        {
                            var LOAD_URL = supplant( QUIZ_TEMPLATE, { id : quizID } );

                             $log.debug(
                                 "loadQuiz( quizID={0} )",
                                 [ quizID ]
                             );

                             // Loads quiz JSON from local data file and delivers a quiz instance

                             return $http
                                     .get( LOAD_URL )
                                     .then( function( response )
                                     {
                                        return quizBuilder.fromJSON( response.data );
                                     });
                        },

                        /**
                         * Calculate user test score for the specified quiz
                         * NOTE: this is currently performed client-side for now...
                         *
                         * @return Promise
                         */
                        submitQuiz = function( quiz, email )
                        {
                             $log.debug( "submitQuiz()" );

                             // Normally we have remote REST services...
                             // return $http.post( URL.SUBMIT_QUIZ, { quiz : quiz, who : email } );

                             // For now, ask the quiz to calculate its own score...

                             return makeResolved( scoreBuilder.calculateScore( quiz ) );
                        };


                   // Publish Authentication delegate instance/object with desired API

                   return {

                       loadQuiz        : loadByID,
                       submitQuiz      : submitQuiz

                   };

                };

            return [ "$http", "$q", "$log", QuizDelegate ];
        });

}( define ));
