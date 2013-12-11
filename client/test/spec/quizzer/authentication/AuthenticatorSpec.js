/**
 * Jasmine Tests for the AuthenticationDelegate
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define ){
    "use strict";

    var dependencies = [
        'auth/Session',
        'auth/Authenticator'
    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( Session, Authenticator )
    {

        describe( "Tests for `Authenticator` delegate", function()
        {

            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************

            /**
             * Load the `test module`
             */
            beforeEach( function()
            {
                module( 'test.quizzler' );

                /**
                 * Configure disposable module with values and factories
                 */
                module( function( $provide )
                {
                    $provide.service( 'session',         Session       );
                    $provide.service( 'authenticator',   Authenticator );

                });
            });



            it( "Authenticator should be defined", inject( function ( authenticator )
            {
                expect( authenticator ).toBeDefined();

            }));



            // ******************************************************
            // login() Tests
            // ******************************************************

            describe("Tests for login() ", function ()
            {

                it("valid login returns valid sessionID", inject(function( authenticator )
                {
                    var userName  = "thomasburleson@gmail.com",
                        password  = "slave2Perfection";

                    runs( function ()
                    {
                        return authenticator
                                .login( userName, password )
                                .then(function( response )
                                {
                                    expect( response.session ).toBeDefined();
                                    expect( response.email).toBeDefined( );
                                });
                    });



                }));

                it( "invalid password returns failed login() response", inject( function( authenticator )
                {
                    var userName  = "",
                        password  = "";

                    // Perform Live, async call and test/expect results...

                    runs( function()
                    {

                        return authenticator
                                    .login( userName,  password )
                                    .then( null, function( fault )
                                    {
                                        expect( fault ).toNotBe( null );
                                    });
                    });

                }));

            });

            // ******************************************************
            // logoutUser() Tests
            // ******************************************************

            describe("Tests for logout()", function ()
            {

                it("logoutUser clears session", inject(function( authenticator, $httpBackend )
                {
                    runs (
                        function()
                        {
                            return authenticator.logout( );
                        },
                        function( response )
                        {
                            expect( response[0]).toNotBe( null );
                            expect( response[0].session ).toBeNull();
                        }
                    );

                }));

            });




        });

    });


})( define );


