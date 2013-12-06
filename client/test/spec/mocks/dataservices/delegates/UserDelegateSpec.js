/**
 * Jasmine Tests for the UserDelegate
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define ) {
    "use strict";

    var dependencies = [

        'quizzer/dataservices/constants/urls',
        'quizzer/dataservices/delegates/UserDelegate'

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, UserDelegate )
    {

        var  rootURL = "/",
             URL     = URLTable.delegates.USER;

        describe( "Tests for `UserDelegate` delegate", function()
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
                    $provide.factory( 'userDelegate',   UserDelegate );

                });

                inject( function( contextRoot ){

                    URLTable.setDelegateRoot( rootURL = contextRoot );

                });
            });



            it( "UserDelegate should be defined", inject( function ( userDelegate )
            {
                expect( userDelegate ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests UserDelegate with MOCK $httpBackend", function()
            {
                    /**
                     * Response data extractor; normally provided in response interceptors
                     * @param response
                     * @returns {*|Object|response|Function|.fakeServer.response}
                     */
                var extractData = function( response )
                    {
                        response = response.data;

                        return  ( response.status == "SUCCESS" ) ? response.result   :
                                ( response.status == "FAIL" )    ? response.error    :   null;
                    },
                    server = {
                        response : {
                            status : "SUCCESS",
                            result : {
                                occupation : "Solutions Architect"
                            }
                        },
                        fault : {
                            status : "FAIL",
                            error :  {
                                code    : 401,
                                message : "Unauthorized access not allowed. Please login first!"
                            }
                        }
                    };


                // Clear the Delegate contextRoot for MOCKs

                beforeEach( function()
                {
                    URLTable.setDelegateRoot( "/" );
                });

                // ******************************************************
                // login() Tests
                // ******************************************************

                describe("loadUserDetails() ", function () {

                    it("should return valid User details for valid sessions", inject(function( userDelegate, $httpBackend )
                    {
                        // Simulate response...

                        $httpBackend.when( "GET", URL.USER_DETAILS ).respond( server.response );

                            userDelegate
                                .loadUserDetails( )
                                .then( function( response )
                                {
                                    response = extractData(response);
                                    expect( response).toBeDefined( );

                                });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                    it( "should return failed response for when not logged in", inject( function( userDelegate, $httpBackend )
                    {
                        // Simulate response...

                        $httpBackend.when( "GET", URL.USER_DETAILS ).respond( server.fault );

                        userDelegate
                            .loadUserDetails( )
                            .then( function( fault )
                            {
                                fault = extractData(fault);

                                expect( fault).toBeDefined( );
                                exepct( fault.code).toBe( 401 );

                            });

                        $httpBackend.flush();


                    }));

                });

            });




        });

    });


})( define );


