/**
 * Jasmine Tests for the Session model
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define, describe ){
    "use strict";

    var dependencies = [
        'auth/Session'
    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( Session )
    {
        describe( "Tests for `Session` model", function()
        {
            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************

            /**
             * Load the `test module`
             */
            beforeEach( function()
            {
                module('test.quizzler');
            });

            /**
             * Configure disposable module with Session factory
             */
            beforeEach( module( function( $provide )
            {
               $provide.value('session', new Session() );

            }));

            /**
             * Clear any state in the session
             * (since it is registered with the module)
             */
            afterEach( inject( function( session )
            {

            }));



            // ******************************************************
            // Suite Tests
            // ******************************************************

            /**
             * Test session != null
             */
            it('session should be defined', inject( function ( session )
            {
                expect( session ).toBeDefined();
            }));

            /**
             * Test session default values
             */
            it('session has valid default values', inject( function ( session )
            {
                expect( session.account.userName ) .toEqual( '' );
                expect( session.account.email )    .toEqual( '' );
                expect( session.sessionID )        .toBeNull( );


            }));

            /**
             * Test `clear(true)`
             */
            it( 'clear(true) should clear all state', inject( function( session )
            {
                angular.extend( session,  {
                    account : {
                        userName  : 'Thomas Burleson',
                        email     : 'siriusxm'
                    },
                    sessionID        : 'AD3214'
                });

                expect( session.account.userName ) .toEqual( 'Thomas Burleson' );

                session.clear( );

                expect( session.account.userName ) .toEqual( 'Thomas Burleson' );
                expect( session.account.email )    .toEqual( '' );
                expect( session.sessionID )        .toBeNull( );
            }));

            /**
             *  Test `clear()`
             */
            it( 'clear() should clear all except "userName"', inject( function( session )
            {
                angular.extend( session,  {
                    account     : {
                        userName : 'Thomas Burleson',
                        email    : 'ThomasBurleson@gmail.com'
                    },
                    sessionID   : '113344',
                    error       : {
                        code    : 0,
                        message : null
                    }
                });

                session.clear( true );

                expect( session.account.userName ) .toEqual( '' );
                expect( session.account.email )    .toEqual( '' );
                expect( session.sessionID )        .toBeNull( );
            }));

            /**
             * Test `clear()` response
             */
            it( 'clear() should return the session reference', inject( function( session )
            {
                var response = session.clear();

                expect( response ).toBe( session );
            }));

        });

    });


})( define, describe );


