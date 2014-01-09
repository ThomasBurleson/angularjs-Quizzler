/**
 * ******************************************************************************************************
 *
 *   Authenticator
 *
 *   Data service proxy to Authentication API that authorizes and authenticates the specified user.
 *
 *  @author     Thomas Burleson
 *  @date       December, 2013
 *
 *
 * ******************************************************************************************************
 */
(function ( define ) {
    "use strict";

    define([
            'utils/supplant',
            'utils/createGuid',
            'utils/crypto/md5'
        ],
        function ( supplant, createGuid, md5 )
        {
            var Authenticator = function ( $http, $q, $log )
                {
                   $log = $log.getInstance( "Authenticator" );

                        /**
                         * Util function to build a resolved promise
                         * @returns {promise|*|promise}
                         */
                    var makeResolved = function( response )
                        {
                            var dfd = $q.defer();
                                dfd.resolve( response );

                            return dfd.promise;
                        },
                        makeRejected = function( fault )
                        {
                            var dfd = $q.defer();
                            dfd.reject( fault );

                            return dfd.promise;
                        },

                        /**
                         * Request user authentication
                         * @return Promise
                         */
                        loginUser = function( email, password )
                        {
                             $log.debug(
                                 "loginUser( email={0}, password={1} )",
                                 [ email, password ]
                             );

                             // Normally we have remote REST services...
                             // return $http.post( URL.LOGIN, { email : email, password : md5.encrypt(password) } );

                             return ( email === "" ) ?
                                    makeRejected( "A valid email is required!" ) :
                                    makeResolved({ session : createGuid(), email : email });
                        },

                        /**
                         * Logout user
                         * @return Promise
                         */
                        logoutUser = function()
                        {
                             $log.debug( "logoutUser()" );

                             // Normally we have remote REST services...
                             // return $http.get( URL.LOGOUT );

                             return makeResolved({
                                 session : null
                             });
                        },

                        /**
                         * Change user password
                         * @return Promise
                         */
                        changePassword = function( email, newPassword, password )
                        {

                            $log.debug( "changePassword ( email={0}, newPassword={1}", [email,  newPasword]);

                            //  return $http.post( URL.PASSWORD_CHANGE, {
                            //      userName    : email,
                            //      oldPassword : md5.encrypt(password ),
                            //      newPassword : md5.encrypt(newPassword)
                            //  });

                            return makeResolved( {
                                email    : email,
                                password : newPassword
                            });
                        },

                         /**
                          * Reset user password
                          * @return Promise
                          */
                         resetPassword = function( email, password, hint )
                         {
                             $log.debug( "resetPassword( password={0}, hint={1}", [password, hint] );

                            // return $http.post( URL.PASSWORD_RESET, {
                            //     userName     : email,
                            //     newPassword  : md5.encrypt(password),
                            //     passwordHint : md5.encrypt(hint)
                            // });

                            return changePassword( email,  password );
                         };


                   // Publish Authentication delegate instance/object with desired API

                   return {

                       login           : loginUser,
                       logout          : logoutUser,
                       changePassword  : changePassword,
                       resetPassword   : resetPassword

                   };

                };

            return [ "$http", "$q", "$log", Authenticator ];

        });

}( define ));
