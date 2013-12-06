/**
 * Jasmine Tests for the CatalogDelegate
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define ){
    "use strict";

    var dependencies = [

        'quizzer/dataservices/constants/urls',
        'quizzer/dataservices/delegates/gifts/CatalogDelegate',
        'quizzer/utils/supplant'

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, CatalogDelegate, supplant )
    {

        var  rootURL = "/",
             URL     = URLTable.delegates.CATALOG;

        describe( "Tests for `CatalogDelegate` delegate", function()
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
                    $provide.factory( 'catalog',   CatalogDelegate );

                    inject( function( contextRoot )
                    {
                        URLTable.setDelegateRoot( rootURL = contextRoot );
                    });

                });

            });



            it( "CatalogDelegate should be defined", inject( function ( catalog )
            {
                expect( catalog ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests Gift CatalogDelegate with MOCK $httpBackend", function()
            {
                    /**
                     * Response data extractor; normally provided in response interceptors
                     * @param response
                     * @returns {*|Object|response|Function|.fakeServer.response}
                     */
                var extractData = function( response )
                {
                    response = response.data;

                    return ( response.responseStatus == "SUCCESS" ) ? response.response : null;
                };


                // Clear the Delegate contextRoot for MOCKs

                beforeEach( function()
                {
                    URLTable.setDelegateRoot( "/" );
                });

                // ******************************************************
                // loadAll() Tests
                // ******************************************************

                describe( "Tests for loadAll() ", function () {

                    it( "should get expected list of all catalog items", inject(function( catalog, $httpBackend )
                    {
                        var response = {};

                        // Simulate response...

                        $httpBackend.when( "GET", URL.LIST_ALL ).respond( response );

                        catalog
                            .loadAll( )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.length ).toBeGreaterThan( 0 );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                });




            });


        });

    });


})( define );


