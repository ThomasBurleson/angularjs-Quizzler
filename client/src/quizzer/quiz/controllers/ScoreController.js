/**
 *
 *  This ScoreController module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
(function( define ) {
    "use strict";

    /**
     * Register the ScoreController class with RequireJS
     */
    define( [ 'utils/supplant' ], function ( supplant )
    {
            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
        var ScoreController = function( $scope, session, $log )
            {
                $log = $log.getInstance( "ScoreController" );
                $log.debug( "constructor() ");

                // Configure presentation model data for view consumption

                $scope.title  = session.score ? session.score.quizName   : 0;
                $scope.grade  = session.score ? session.score.totalScore : 0;
                $scope.scores = session.score ? session.score.items      : [ ];
                $scope.email  = session.account.email;


                $scope.logout = session.logout;
            };

        // Register as global constructor function

        return [ "$scope", "session", "$log", ScoreController ];

    });


}( define ));
