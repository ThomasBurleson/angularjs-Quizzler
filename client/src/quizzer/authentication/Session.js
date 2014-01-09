/**
 *
 *  This Session module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @date    December, 2013
 *
 */
(function (define ) {
    "use strict";

    /**
     * Register the Session class with RequireJS
     */
    define( [], function ( ) {

        var validate = function ( target, defaultVal )
            {
                return target || defaultVal;
            },
            onClear  = function( all )
            {
                _session.account.userName       = validate( all, false ) ? '' : _session.account.userName;
                _session.account.password       = '';
                _session.account.email          = '';
                _session.sessionID              = null;

                // TODO - refactor since these are specific to the `quiz` module

                _session.quiz                   = undefined;
                _session.score                  = undefined;
                _session.selectedQuiz           = 1;

                return _session;
            },
            _session = {
                account : {
                    userName          : '',
                    password          : '',
                    email             : ''
                },

                sessionID         : null,
                clear             : onClear,
                logout            : onClear,

                selectedQuiz      : 1
            };


        /**
         * Publishes a constructor function which returns the `session` singleton instances
         *
         * @returns Hashmap
         * @constructor
         */
        return function () {
            return _session;
        };

    });


}( define  ));
