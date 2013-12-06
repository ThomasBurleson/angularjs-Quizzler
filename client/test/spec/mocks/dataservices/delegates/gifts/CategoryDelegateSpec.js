/**
 * Jasmine Tests for the CategoryDelegate
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define ){
    "use strict";

    var dependencies = [

        'quizzer/dataservices/constants/urls',
        'quizzer/dataservices/delegates/gifts/CategoryDelegate',
        'quizzer/utils/supplant'

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, CategoryDelegate, supplant )
    {

        var  rootURL = "/",
             URL     = URLTable.delegates.CATEGORY;

        describe( "Tests for `CategoryDelegate` delegate", function()
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
                    $provide.factory( 'categories',   CategoryDelegate );


                });

                inject( function( contextRoot ){

                    URLTable.setDelegateRoot( rootURL = contextRoot );

                });
            });



            it( "CategoryDelegate should be defined", inject( function ( categories )
            {
                expect( categories ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests Gift CategoryDelegate with MOCK $httpBackend", function()
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


                describe( "Tests for loadCategoryGroups() ", function () {

                    it( "should get expected list of all categories groups", inject(function( categories, $httpBackend )
                    {
                        var response = {
                            responseStatus: "SUCCESS",
                            response: [
                                {
                                    code: "T100",
                                    label: "Popular Choices",
                                    description: "100 Most Popular (or change label to",
                                    categories: [],
                                    isDefault: true
                                },
                                {
                                    code: "TP",
                                    label: "Top Performers",
                                    description: "dynamically generated based on market returns (last day, week, year)",
                                    categories: [],
                                    isDefault: false
                                },
                                {
                                    code: "KT",
                                    label: "Kids & Teens",
                                    categories: [
                                        {
                                            code: "TRAVEL",
                                            label: "Travel"
                                        },
                                        {
                                            code: "HOME",
                                            label: "Home"
                                        },
                                        {
                                            code: "REST",
                                            label: "Eating Out"
                                        },
                                        {
                                            code: "PETS",
                                            label: "Pets"
                                        },
                                        {
                                            code: "GAMES",
                                            label: "Games"
                                        },
                                        {
                                            ode: "INTERNET",
                                            abel: "Internet"
                                        },
                                        {
                                            code: "FIN",
                                            label: "Finance"
                                        }
                                    ]
                                }
                            ]
                        };


                        // Simulate response...

                        $httpBackend.when( "GET", URL.LOAD_ALL_GROUPS ).respond( response );

                        categories
                            .loadCategoryGroups( )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.length ).toBe( 3 );
                                expect( response[0].code ).toEqual( "T100" );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                });

                describe( "Tests for loadCategories() ", function () {

                    it( "should get expected list of all categories", inject(function( categories, $httpBackend )
                    {
                        var response = {
                            responseStatus: "SUCCESS",
                            response: [
                                {
                                    code: "ART",
                                    label: "Art"
                                },
                                {
                                    code: "BOOZE",
                                    label: "Booze"
                                },
                                {
                                    code: "CARS",
                                    label: "Cars & Bikes"
                                },
                                {
                                    code: "COOK",
                                    label: "Cooking"
                                },
                                {
                                    code: "BEV",
                                    label: "Drinks"
                                },
                                {
                                    code: "REST",
                                    label: "Eating Out"
                                },
                                {
                                    code: "ELEC",
                                    label: "Electronics"
                                },
                                {
                                    code: "FASH",
                                    label: "Fashion"
                                },
                                {
                                    code: "FIN",
                                    label: "Finance"
                                },
                                {
                                    code: "FOOD",
                                    label: "Food"
                                }
                            ]
                        };


                        // Simulate response...

                        $httpBackend.when( "GET", URL.LOAD_ALL ).respond( response );

                        categories
                            .loadCategories( )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.length ).toBe( 10 );
                                expect( response[9].code ).toEqual( "FIN" );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                });


                describe( "Tests for findGroupByCode() ", function () {

                    it( "should get expected category group if valid group code is specified", inject(function( categories, $httpBackend )
                    {
                        var response = {
                            responseStatus: "SUCCESS",
                            response: {
                                code: "TP",
                                label: "Top Performers",
                                description: "dynamically generated based on market returns (last day, week, year)",
                                categories: [],
                                isDefault: false
                            }
                        };


                        // Simulate response...

                        $httpBackend
                            .when( "GET", supplant( URL.LOOKUP_GROUP, { code : "TP" } ))
                            .respond( response );

                        categories
                            .findGroupByCode( )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.length ).toBe( 10 );
                                expect( response.code ).toEqual( "TP" );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                });


            });


        });

    });


})( define );


