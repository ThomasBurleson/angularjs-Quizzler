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
        'auth/Session',
        'auth/Authenticator',
        'auth/LoginController'
    ];

    define( dependencies, function ( Session, Authenticator, LoginController )
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
                _session         = null,
                _scope           = null,
                _location        = null,
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
                    $provide.service( 'session',         Session        );
                    $provide.service( 'authenticator',   Authenticator  );

                });

            });

            beforeEach( inject( function( $rootScope, $injector, $controller )
            {
                _location        = $injector.get( "$location" );
                _session         = $injector.get( "session" );
                _scope           = $rootScope.$new();

                // Prepare to intercept _location navigation calls...
                spyOn( _location, 'path').andCallFake( new LocationMock('/login').path );

                // Create instances LoginController with known scope...

                $controller( LoginController, {
                    authenticator   : $injector.get( "authenticator" ),
                    $q              : $injector.get( "$q" ),
                    $log            : $injector.get( '$log' ),
                    session         : _session,
                    $scope          : _scope,
                    $location       : _location
                });

            }));

            afterEach( function( )
            {
                _scope = null;
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


            it('valid login should create a valid session', inject(function($timeout)
            {
                _scope.email = "ThomasBurleson@Gmai.com";
                _scope.password = "slaveToExcellence";

                _scope.submit();

                // Since submit() internally uses promises...
                $timeout.flush();

                expect( _session.sessionID.length ).toBeGreaterThan( 0 );
                expect( _location.path()).toBe( '/quiz' );

            }));

            it('invalid login should create a valid session', inject(function($timeout)
            {
                _scope.email    = "";
                _scope.password = "";

                _scope.submit();

                // Since submit() internally uses promises...
                $timeout.flush();

                expect( _session.sessionID ).toBeNull( );
            }));

            it('logout should clear current session', inject(function($timeout)
            {
                _session.sessionID = "someDummyGUID";

                _scope.logout();

                // Since submit() internally uses promises...
                $timeout.flush();

                expect( _session.sessionID ).toBeNull( );
                expect( _location.path()).toBe( '/login' );

            }));


        });

    });


})( define, describe );


