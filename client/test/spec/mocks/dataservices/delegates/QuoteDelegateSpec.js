/**
 * Jasmine Tests for the QuoteDelegate
 * Note: Angular-mocks provides `module`, `inject` global methods
 *
 * @author Thomas Burleson
 *
 */
(function( define ){
    "use strict";

    var dependencies = [

        'quizzer/dataservices/constants/urls',
        'quizzer/dataservices/delegates/QuoteDelegate',

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, QuoteDelegate )
    {

        var  rootURL         = "/",
             URL = URLTable.delegates.QUOTES;

        describe( "Tests for `QuoteDelegate` delegate", function()
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
                    $provide.factory( 'stockDelegate',   QuoteDelegate );


                });

                inject( function( contextRoot ){

                    URLTable.setDelegateRoot( rootURL = contextRoot );

                });
            });



            it( "QuoteDelegate should be defined", inject( function ( stockDelegate )
            {
                expect( stockDelegate ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests QuoteDelegate with MOCK $httpBackend", function()
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
                    },
                    response = {
                        responseStatus: "SUCCESS",
                        response: {
                            symbol: "GOOG",
                            price: 887.76,
                            change: 0,
                            chartUrlSmall: "http://ichart.finance.yahoo.com/t?s=GOOG",
                            chartUrlLarge: "http://chart.finance.yahoo.com/w?s=GOOG",
                            lastUpdated: 0,
                            bid: 885.4,
                            ask: 886.6,
                            volume: 1341111,
                            dayLow: 884.87,
                            dayHigh: 897,
                            yearLow: 636,
                            yearHigh: 928,
                            previousClose: 889.068,
                            lastTradeTime: "4:00pm ET",
                            lastTradeDate: "9/16/2013",
                            dayRange: "884.87 - 897.00",
                            yearRange: "636.00 - 928.00",
                            priceChange: "-1.308",
                            percentChange: "-0.15%",
                            isUp: false
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

                describe("getStockDetails() ", function () {

                    it("should return valid Stock details", inject(function( stockDelegate, $httpBackend )
                    {
                        // Simulate response...

                        $httpBackend.when( "GET", URL.GET_STOCK_DETAILS ).respond( response );

                            stockDelegate
                                .getStockDetails( "   GOOG" )
                                .then( function( response )
                                {
                                    response = extractData(response);

                                    expect( response)            .toBeDefined( );
                                    expect( response.symbol ) .toEqual( "GOOG" );

                                });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                    it( "should return failed response for invalid Stock symbol", inject( function( stockDelegate, $httpBackend )
                    {
                        // Simulate response...

                        $httpBackend.when( "GET", URL.GET_STOCK_DETAILS ).respond( response );

                        stockDelegate
                            .getStockDetails( "G11G" )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response).toBeUndefined( );

                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();


                    }));

                });

            });




        });

    });


})( define );


