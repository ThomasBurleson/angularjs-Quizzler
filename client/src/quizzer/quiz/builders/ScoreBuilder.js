/**
 *
 *  This QuizBuilder module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
(function( define, _ ) {
    "use strict";

    /**
     * Register the QuizBuilder class with RequireJS
     */
    define([
            'utils/supplant',
            'utils/logger/ExternalLogger'
        ],
        function ( supplant, $log )
        {
                /**
                 * Labels table used to convert numbered lists to `lettered` lists
                 * @type {Array}
                 */
            var LIST_LABELS   = [ "A", "B", "C", "D", "E", "F", "G", "H" ],

                /**
                 * Constructor function used by AngularJS to create instances of
                 * a service, factory, or controller.
                 *
                 * @constructor
                 */
                ScoreBuilder = function( )
                {
                    $log = $log.getInstance( "ScoreBuilder" );

                        /**
                         * Partial application to capture the quiz instance and
                         * allow subsequent calculation of the score.
                         *
                         * @param quiz
                         * @returns {Function}
                         */
                    var calculateScoreDetails = function( quiz )
                        {
                            var answers = {
                                    expected : [ ],
                                    given    : [ ]
                                },

                                /**
                                 * Gather all user-given answers into flat array
                                 */
                                gatherAnswers = function()
                                {
                                    $log.debug( "gatherAnswers()" );

                                    answers.expected = _.pluck( quiz.questions, "answer" ),     // Expected answers
                                    answers.given    = _.pluck( quiz.questions, "selected" );    // User-provided answers, @see calculateTotal()

                                    // NOTE: Since the answers are temporarily part of each question,
                                    //       we should clear user-given answers !

                                    _.every( quiz.questions, function( question )
                                    {
                                        // Clear `selected` value..
                                        if ( question.hasOwnProperty("selected") )
                                        {
                                            delete question.selected;
                                        }
                                    });
                                },

                                /**
                                 *
                                 * @returns {number}
                                 */
                                calculateTotal = function()
                                {
                                    var j,
                                        total    = 0,
                                        count    = answers.expected.length,
                                        expected = answers.expected,
                                        given    = answers.given;

                                    $log.debug( "calculateTotal()" );

                                    // Loop to check if given answer matches expected...
                                    for ( j = 0; j < count; j++ )
                                    {
                                        if ( j >= given.length ) {
                                            break;
                                        }
                                        if ( expected[j] == given[j] ) {
                                            total += 1;
                                        }
                                    }

                                    // Make sure that total score is not > 100%
                                    return Math.min( 100, Math.ceil( (total/count)*100 ));
                                },

                                /**
                                 *
                                 * @returns {Array}
                                 */
                                buildReviewList = function()
                                {
                                    var j,
                                        list     = [],
                                        isCorrect= false,
                                        question = null,
                                        expected = answers.expected,
                                        given    = answers.given,
                                        count    = expected.length,
                                        /**
                                         * For the specified index, lookup the `choice`
                                         * for the current question.
                                         * @param index
                                         * @returns {*} String
                                         */
                                        choiceAt = function( index )
                                        {
                                          return question.choices[ index ];
                                        },
                                        /**
                                         * Convert index value to "letter" label
                                         * @param index
                                         * @returns {*} Letter character
                                         */
                                        labelAt  = function( index )
                                        {
                                            return LIST_LABELS[ index ];
                                        };

                                    $log.debug( "buildReviewList()" );

                                    // Loop all answers to build list of `review status` object
                                    for ( j = 0; j < count; j++ )
                                    {

                                        question  = quiz.questions[j];
                                        isCorrect = expected[j] == given[j];


                                        // Build list of `score` items

                                        list.push({

                                            index    : j + 1,
                                            title    : question["question"],
                                            details  : question["details"],
                                            correct  : isCorrect,
                                            expected : supplant( "{0}. {1}", [ labelAt(expected[j]), choiceAt( expected[j] ) ] ),
                                            answered : isCorrect          ? supplant( "{0}. {1}", [ labelAt(given[j]), choiceAt( given[j] ) ] ) :
                                                       (given[j] != null) ? supplant( "{0}. {1}", [ labelAt(given[j]), choiceAt( given[j] ) ] ) : "- no answer given -"
                                        });

                                    }

                                    return list;
                                },

                                /**
                                 * Normally this feature would be server-side...
                                 * for now include it here in the Quiz model
                                 */
                                buildScoreInstance = function ()
                                {
                                    var score;

                                    $log.debug( "buildScoreInstance()" );

                                    gatherAnswers();

                                    // Now calculate `total score` and build a list of `score` items
                                    score = {
                                        quizName   : quiz.name,
                                        totalScore : calculateTotal(),
                                        items      : buildReviewList()
                                    };

                                    $log.debug( supplant( "calculateScore() == {totalScore} ", score) );

                                    return score;
                                };

                            return buildScoreInstance();
                        };

                    // Publish API to build Quiz instances from JSON data

                    return {

                        calculateScore : calculateScoreDetails
                    };


                };

            // Register as global constructor function

            return [ "$log", ScoreBuilder ];

        });


}( define, _ ));
