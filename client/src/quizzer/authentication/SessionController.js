/**
 *
 *  This LoginController module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
(function( define ) {
    "use strict";

    /**
     * Register the SessionController class with RequireJS
     */
    define( [ 'utils/supplant' ], function ( supplant )
    {
        var VIEW_LOGIN = "/login",

            /**
             * SessionController
             * @constructor
             */
            SessionController = function( session, $rootScope, $log, $location )
            {
                    /**
                     * AutoRouteToLogin()
                     */
                var validateSession = function()
                    {
                        if ( session && !session.sessionID )
                        {
                            if ( $location.path() != VIEW_LOGIN )
                            {
                                $log.debug( "session is invalid - routing to '{0}' ", [ VIEW_LOGIN ] );
                                $location.path( VIEW_LOGIN );
                            }
                        }
                    };

                $log = $log.getInstance( "SessionController" );
                $log.debug( "constructor() ");

                // TODO - remember the bookmark url... and reroute to original bookmark AFTER login finishes
                // TODO - instead of reroute to Login... simply show the Login overlay WITHOUT changing $location

                // Make sure that we always have a valid session

                $rootScope.$on('$routeChangeSuccess', function()
                {
                    validateSession();
                });

                // Watch the sessionID and auto route to the Login view
                // if logout() is invoked...

                $rootScope.$watch( function getSession()
                {
                    return session.sessionID;

                }, validateSession );


            };

        // Register as global constructor function

        return [ "session", "$rootScope", "$log", "$location", SessionController ];

    });


}( define ));
