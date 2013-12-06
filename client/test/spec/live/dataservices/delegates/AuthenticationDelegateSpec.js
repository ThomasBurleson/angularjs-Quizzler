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

        'quizzer/dataservices/constants/urls',
        'quizzer/dataservices/model/Session',
        'quizzer/dataservices/delegates/AuthenticationDelegate',

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, Session, AuthenticationDelegate )
    {

        var  rootURL         = "/",
             URL             = URLTable.delegates.AUTHENTICATION;

        describe( "Tests for `AuthenticationDelegate` delegate", function()
        {

            var INTERVAL_TIMEOUT = 2000;

            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************

            /**
             * Load the `test module`
             */
            beforeEach( function()
            {
                module( 'test.quizzer.Dataservices' );

                /**
                 * Configure disposable module with values and factories
                 */
                module( function( $provide )
                {
                    $provide.value(   'session',        Session()     );
                    $provide.factory( 'authDelegate',   AuthenticationDelegate );

                    inject( function( contextRoot ){

                        URLTable.setDelegateRoot( rootURL = contextRoot );

                    });
                });
            });



            it( "AuthenticationDelegate should be defined", inject( function ( authDelegate )
            {
                expect( authDelegate ).toBeDefined();

            }));



            // ******************************************************
            // login() Tests
            // ******************************************************

            describe("Tests for login() ", function ()
            {

                it("valid login returns valid sessionID", inject(function( authDelegate )
                {
                    var userName  = "admin@quizzer.com",
                        password  = "admin";

                    // Perform Live, async call and test/expect results...

                    runs( function ()
                    {
                        return authDelegate
                                .login( userName,  password )
                                .then(function( response )
                                {
                                    expect( response.authToken ).toBeDefined();
                                    expect( response.authToken.length).toBeGreaterThan( 0 );
                                });
                    });



                }));

                it( "invalid password returns failed login() response", inject( function( authDelegate )
                {
                    var userName  = "ThomasBurleson",
                        password  = "",
                        response  = null;

                    // Perform Live, async call and test/expect results...

                    runs( function()
                    {
                        return authDelegate
                                    .login( userName,  password )
                                    .then(
                                        function( response ) {

                                        },
                                        function( fault )
                                        {
                                            expect( response ).toBe( false );
                                        }
                                    );
                    });

                }));

            });

            // ******************************************************
            // logoutUser() Tests
            // ******************************************************

            describe("Tests for logout()", function ()
            {

                it("logoutUser responds properly", inject(function( authDelegate, $httpBackend )
                {
                    var response;

                    // Perform Live, async call and test/expect results...

                    runs (
                        function()
                        {
                            return authDelegate.logout( );
                        },
                        function( response )
                        {
                            expect( response ).toBeDefined();
                        }
                    );

                }));

            });




        });

    });


})( define );


