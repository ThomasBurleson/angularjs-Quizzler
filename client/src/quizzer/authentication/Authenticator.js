/**
 * ******************************************************************************************************
 *
 *	 Authenticator
 *
 *	 Data service proxy to Authentication API that authorizes and authenticates the specified user.
 *
 *  @author     Thomas Burleson
 *  @date       December, 2013
 *
 *
 * ******************************************************************************************************
 */
(function ( define ) {
    "use strict";

    var dependencies = [
        'mindspace/utils/supplant',
        'mindspace/utils/createGuid',
        'mindspace/utils/crypto/md5'
    ];

    define( dependencies, function ( supplant, createGuid, md5 )
    {
        var Authenticator = function ( session, $http, $q, $log )
            {
               $log = $log.getInstance( "Authenticator" );

                var user = session.user,

                    /**
                     * Util function to build a resolved promise
                     * @returns {promise|*|promise}
                     */
                    makeResolved = function( response )
                    {
                        var dfd = $q.defer();
                            dfd.resolve( response );

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
                         // return $http.post( URL.LOGIN, { userName : userName, password : md5.encrypt(password) } );


                         return makeResolved({
                             session : createGuid(),
                             email   : email
                         });
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
                    changePassword = function( newPassword )
                    {
                        user.newPassword = newPassword;

                        $log.debug( "changePassword ( userName={userName}, newPassword={newPassword}", session );

                        //  return $http.post( URL.PASSWORD_CHANGE, {
                        //      userName    : user.userName,
                        //      oldPassword : md5.encrypt(user.password),
                        //      newPassword : md5.encrypt(user.newPassword)
                        //  });

                        return makeResolved( true );
                    },

                     /**
                      * Reset user password
                      * @return Promise
                      */
                     resetPassword = function( password, hint )
                     {
                         $log.debug( "resetPassword( password={0}, hint={1}", [password, hint] );

                        // return $http.post( URL.PASSWORD_RESET, {
                        //     userName     : user.userName,
                        //     email        : user.email,
                        //     newPassword  : md5.encrypt(password),
                        //     passwordHint : md5.encrypt(hint)
                        // });

                        return makeResolved( true );
                     };


               // Publish Authentication delegate instance/object with desired API

               return {

                   login           : loginUser,
                   logout          : logoutUser,
                   changePassword  : changePassword,
                   resetPassword   : resetPassword

               };

            };

        return [ "session", "$http", "$q", "$log", Authenticator ];
    });

}( define ));
