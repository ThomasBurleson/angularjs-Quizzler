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
             urlAuthenticate = URLTable.delegates.AUTHENTICATION;

        describe( "Tests for `AuthenticationDelegate` delegate", function()
        {

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


                });

                inject( function( contextRoot ){

                    URLTable.setDelegateRoot( rootURL = contextRoot );

                });
            });



            it( "AuthenticationDelegate should be defined", inject( function ( authDelegate )
            {
                expect( authDelegate ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests with MOCK $httpBackend", function()
            {
                    /**
                     * Response data extractor; normally provided in response interceptors
                     * @param response
                     * @returns {*|Object|response|Function|.fakeServer.response}
                     */
                var extractData = function( response )
                {
                    response = response.data;

                    return ( response.status == "SUCCESS" ) ? response.response : null;
                };


                // Clear the Delegate contextRoot for MOCKs

                beforeEach( function()
                {
                    URLTable.setDelegateRoot( "/" );
                });

                // ******************************************************
                // login() Tests
                // ******************************************************

                describe("login() ", function () {

                    it("should return valid sessionID", inject(function( authDelegate, $httpBackend )
                    {
                        var userName  = "ThomasBurleson",
                            password  = "triumph",
                            sessionID = "12345";

                        // Simulate response...

                        $httpBackend.when( "POST", urlAuthenticate.LOGIN ).respond({
                            status  : "SUCCESS",
                            response        : {
                                userName  : userName,
                                sessionID : sessionID
                            }
                        });

                            authDelegate
                                .login( userName,  password )
                                .then( function( response )
                                {
                                    response = extractData(response);

                                    expect( response)            .toBeDefined( );
                                    expect( response.sessionID ) .toEqual( "12345" );

                                });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                    it( "should return failed login() response with invalid password ", inject( function( authDelegate, $httpBackend )
                    {
                        var userName  = "ThomasBurleson",
                            password  = "";

                        $httpBackend.when( "POST", urlAuthenticate.LOGIN ).respond({
                            status          : "SUCCESS",
                            response        : false,
                            responseDetails : null
                        });

                            authDelegate
                                .login( userName,  password )
                                .then ( function( response )
                                {
                                    response = extractData( response );

                                    expect( response).toBe( false );

                                });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();


                    }));

                });

                // ******************************************************
                // logoutUser() Tests
                // ******************************************************

                describe("logout()", function () {

                    it("should logout and respond properly", inject(function( authDelegate, $httpBackend )
                    {
                        $httpBackend.when( "GET", urlAuthenticate.LOGOUT).respond({
                            status          : "SUCCESS",
                            response        : true
                        });

                        authDelegate
                            .logout()
                            .then ( function( response )
                            {
                                response = extractData( response );

                                expect( response).toBe( true );

                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();
                    }));

                });


            });




        });

    });


})( define );


