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
     * Register the LoginController class with RequireJS
     */
    define( [ 'utils/supplant' ], function ( supplant )
    {
        var SERVER_NOT_RESPONDING  = "The Quizzler server is not responding",
            UNABLE_TO_CONNECT      = 'Unable to connect to secure Quizzler dataservices',
            TIMEOUT_RESPONSE       = 'Dataservice did not respond and timed out.',
            PAGE_NOT_FOUND         = '404 Not Found',

            /**
             * Constructor function used by AngularJS to create instances of
             * a service, factory, or controller.
             *
             * @constructor
             */
            LoginController = function( session, authenticator, $scope, $q, $log, $location )
            {
                $log = $log.getInstance( "LoginController" );
                $log.debug( "constructor() ");

                var announceNA = function()
                    {
                        var message = "This feature is not yet available!";

                        $log.error( message );
                        //$window.alert( message );
                    },
                    /**
                     * Mutator or accessor to easily set the errorMessage and title
                     */
                    errorMessage = function( msg )
                    {
                        $scope.hasError = (msg !== "");
                        $scope.errorMessage = $scope.errorMessage || '';

                        // Allows errorMessage() to be accessor or mutator
                        if ( !angular.isUndefined(msg ) )  {
                            $scope.errorMessage = msg || '' ;
                            $scope.title        = UNABLE_TO_CONNECT;
                        }

                        return $scope.errorMessage;
                    },

                    /**
                     * Delegate login process to $authenticator and `wait` for a response
                     *
                     */
                    onLogin = function ()
                    {
                        $log.debug( "onLogin( email={email}, password={password} )", $scope );

                        $log.tryCatch( function()
                        {
                            return  authenticator
                                        .login( $scope.email, $scope.password )
                                        .then( function onResult_login( response )
                                        {
                                            $log.debug( "onResult_login( sessionID={session}" ,response );

                                            session.sessionID = response.session;
                                            session.account   = {
                                              userName :  $scope.email,
                                              password :  $scope.password,
                                              email    :  $scope.email
                                            };

                                            errorMessage( "" );

                                            // Navigate to the Quiz
                                            // TODO - uses constants file for view navigations...

                                            $location.path( '/quiz' );

                                            return session;
                                        },
                                        function onFault_login( fault )
                                        {
                                            fault = fault || SERVER_NOT_RESPONDING;
                                            fault = supplant( String(fault), [ "onLogin()" ] );

                                            $log.error( fault.toString() );

                                            // force clear any previously valid session...
                                            session.sessionID = null;
                                            errorMessage( fault.toString() );

                                            if ( fault == TIMEOUT_RESPONSE ) { errorMessage( SERVER_NOT_RESPONDING ); }
                                            if ( fault == PAGE_NOT_FOUND )   { errorMessage( PAGE_NOT_FOUND );        }

                                            return $q.reject( fault );
                                        });
                        });
                    },
                    onLogout = function()
                    {
                        $log.debug( "onLogout( )" );

                        $log.tryCatch( function()
                        {
                            return authenticator
                                        .logout( )
                                        .then( function onResult_logout( )
                                        {
                                            $log.debug( "onResult_logout()" );

                                            $scope.sessionID = null;
                                            session.sessionID = null;

                                            errorMessage( "" );

                                            return session;
                                        },
                                        function onFault_login( fault )
                                        {
                                            fault = fault || SERVER_NOT_RESPONDING;
                                            $log.error( fault.toString() );

                                            // force clear any previously valid session...
                                            session.sessionID = null;
                                            errorMessage( fault );

                                            if ( fault == TIMEOUT_RESPONSE ) { errorMessage( SERVER_NOT_RESPONDING ); }
                                            if ( fault == PAGE_NOT_FOUND )   { errorMessage( PAGE_NOT_FOUND );        }

                                            return $q.rejected( session );
                                        });
                        });
                    };


                $scope.email     = "ThomasBurleson@gmail.com";
                $scope.password  = "none";
                $scope.sessionID = session.sessionID;
                $scope.errorMessage = "";

                $scope.submit   = onLogin;
                $scope.logout   = onLogout;
                $scope.register = announceNA;

            };

        // Register as global constructor function

        return [ "session", "authenticator",  "$scope", "$q", "$log", "$location", LoginController ];

    });


}( define ));
