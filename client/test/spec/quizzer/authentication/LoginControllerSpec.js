/**
 * Jasmine Tests for the LoginController
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 * @date December, 2013
 *
 */
(function( define, describe ){
    "use strict";

    var dependencies = [
        'utils/Factory',
        'auth/Session',
        'auth/Authenticator',
        'auth/LoginController'
    ];

    define( dependencies, function ( Factory, Authenticator, LoginController )
    {
        describe( "Tests for LoginController", function()
        {
                /**
                 * $location.path() replacement... for testing
                 * @param root
                 * @constructor
                 */
            var LocationMock = function (root)
                {
                    root = root || '';

                    // path() is both an accessor & mutator
                    this.path = function (path) {
                        return path ? root = path : root;
                    };
                },
                _loginController,
                _scope    = null,
                $location = null,
                appName   = 'test.quizzler.Online';


            /**
             * Load the `module`
             */
            beforeEach( function()
            {
                module( appName );
                module( function( $provide, $injector )
                {
                    // Configure injectable instances

                    $provide.service( "session",            Session);
                    $provide.service( "authenticator",      Authenticator );
                    $provide.controller( "loginController", LoginController   );

                    // Prepare to intercept $location navigation calls...

                    $location = $injector.get( "$location" );
                    spyOn( $location, 'path').andCallFake( new LocationMock('/login').path );
                });
            });


            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************

            beforeEach( inject( function( loginController )
            {
                _loginController = loginController;
                _scope           = loginController.$scope;
            }));


            afterEach( function( )
            {
                _loginController = null;
                _scope           = null;
            });


            // ******************************************************
            // Suite Tests
            // ******************************************************

            it('$scope should be configured', function()
            {
                expect( _scope.email ).toBeDefined();
                expect( _scope.password ).toBeDefined();

                expect( _scope.submit ).toBeDefined();
                expect( _scope.logout ).toBeDefined();
            });

            it('valid login should create a valid session', function()
            {
                _scope.email = "ThomasBurleson@Gmai.com";
                _scope.password = "slaveToExcellence";

                runs( function() {
                    return _loginController
                                .submit()
                                .then( function( session )
                                {
                                   expect( session.sessionID.length ).toBeGreaterThan( 0 );
                                   expect( $location.path()).toBe( '/quiz' );
                                });
                });
            });

            it('invalid login should create a valid session', function()
            {
                _scope.email = "";
                _scope.password = "";

                runs( function() {
                    return _loginController
                        .submit()
                        .catch( function( session )
                        {
                            expect( session.sessionID ).toBeNull( );
                        });
                });
            });

            it('logout should clear current session', inject( function( session )
            {
                session.sessionID = "someDummyGUID";

                runs( function() {
                    return _loginController
                        .logout()
                        .then( function( session )
                        {
                            expect( session.sessionID ).toBeNull( );
                            expect( $location.path()).toBe( '/login' );
                        });
                });
            }));

        });

    });


})( define, describe );


