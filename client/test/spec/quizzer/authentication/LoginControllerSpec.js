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

    define( dependencies, function ( Factory, Session, Authenticator, LoginController )
    {
        describe( "Tests for LoginController", function()
        {
                /**
                 * $location.path() replacement... for testing
                 */
            var LocationMock = function (root)
                {
                    root = root || '';

                    // path() is both an accessor & mutator
                    this.path = function (path) {
                        return path ? root = path : root;
                    };
                },
                /**
                 * Same API, no promises...
                 * @constructor
                 */
                AuthenticatorMock = function() {
                    return {
                        login : function( email, password )
                        {
                            return {
                                sessionID : "someDummyGUID",
                                email     : email
                            }
                        },
                        logout : function()
                        {
                            return { session : null };
                        }
                    };
                },
                _loginController = null,
                _scope           = null,
                $location        = null,
                appName          = 'test.quizzler';


            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************


            beforeEach( function()
            {
                // Make sure test app is loaded... @see /test/config/bootstrap.js
                module( appName );

                module( function( $provide )
                {
                    $provide.service( 'session',         Session            );
                    $provide.service( 'authenticator',   AuthenticatorMock  );

                });

            });

            beforeEach( inject( function( $rootScope, $injector, $controller )
            {
                var $q            = $injector.get( "$q" ),
                    $log          = $injector.get( '$log' ),
                    $http         = $injector.get( "$http" ),
                    session       = $injector.get( "session" ),
                    authenticator = $injector.get( "authenticator" );

                // Prepare to intercept $location navigation calls...

                $location = $injector.get( "$location" );
                spyOn( $location, 'path').andCallFake( new LocationMock('/login').path );

                // Create instances LoginController with known scope...

                _scope           = $rootScope.$new();
                _loginController = $controller( LoginController, {
                    session         : session,
                    authenticator   : authenticator,
                    $scope          : _scope,
                    $q              : $q,
                    $log            : $log,
                    $location       : $location
                });

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

                runs( function()
                {
                    return _scope
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

                runs( function()
                {
                    return _scope
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
                    return _scope
                              .logout()
                              .then( function( response )
                              {
                                  expect( response.sessionID ).toBeNull( );
                                  expect( $location.path()).toBe( '/login' );
                              });
                });
            }));

        });

    });


})( define, describe );


