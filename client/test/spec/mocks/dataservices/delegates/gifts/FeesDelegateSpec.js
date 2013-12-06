/**
 * Jasmine Tests for the GiftDelegate
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
        'quizzer/dataservices/delegates/gifts/FeesDelegate',
        'quizzer/utils/supplant'

    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( URLTable, Session, FeesDelegate, supplant )
    {

        var  rootURL         = "/",
             urlsGift = URLTable.delegates.GIFT;

        describe( "Tests for `GiftDelegate` delegate", function()
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
                    $provide.factory( 'feesDelegate',   FeesDelegate );


                });

                inject( function( contextRoot ){

                    URLTable.setDelegateRoot( rootURL = contextRoot );

                });
            });



            it( "GiftDelegate should be defined", inject( function ( feesDelegate )
            {
                expect( feesDelegate ).toBeDefined();

            }));


            // **********************************************************
            // MOCK Tests
            // NOTE: this tests are important to confirm that the client-side dataservices API
            //       works as desired when the mock server responds as expected.
            // **********************************************************


            describe( "Tests Gift FeesDelegate with MOCK $httpBackend", function()
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
                // loadStandardFees() Tests
                // ******************************************************

                describe( "Tests for loadStandardFees() ", function () {

                    it( "should get expected list of fees", inject(function( feesDelegate, $httpBackend )
                    {
                        var result = {
                            denominations: [
                                {
                                    denomination: 25,
                                    fee: 3.75,
                                    total: 28.75
                                },
                                {
                                    denomination: 50,
                                    fee: 4.5,
                                    total: 54.5
                                },
                                {
                                    denomination: 75,
                                    fee: 5.25,
                                    total: 80.25
                                },
                                {
                                    denomination: 100,
                                    fee: 6,
                                    total: 106
                                },
                                {
                                    denomination: 150,
                                    fee: 7.5,
                                    total: 157.5
                                },
                                {
                                    denomination: 200,
                                    fee: 9,
                                    total: 209
                                },
                                {
                                    denomination: 250,
                                    fee: 10.5,
                                    total: 260.5
                                }
                            ],
                            maxAmount    : 1000,
                            minAmount    : 10
                        };

                        // Simulate response...

                        $httpBackend.when( "GET", urlsGift.FEES.LIST_ALL ).respond({
                            responseStatus: "SUCCESS",
                            response      : result
                        });

                        feesDelegate
                            .loadStandardFees( )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.denominations.length ).toEqual( 7 );
                                expect( response.maxAmount).toEqual( 1000 )
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();

                    }));

                });

                // ******************************************************
                // calculateFee() Tests
                // ******************************************************

                describe("Tests for calculateFee()", function () {

                    it( "should calculate fee correctly", inject(function( feesDelegate, $httpBackend )
                    {
                        var amount = 37.50,
                            result = {
                                denomination: 37.5,
                                fee         : 4.12,
                                total       : 41.62
                            };

                        // Simulate response...
                        $httpBackend
                            .when( "POST",  supplant( urlsGift.FEES.CALCULATE, { amount : amount }) )
                            .respond({
                                responseStatus: "SUCCESS",
                                response      : result
                            });

                        feesDelegate
                            .calculateFee( amount )
                            .then( function( response )
                            {
                                response = extractData(response);
                                expect( response.total ).toEqual( 41.62 );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();
                    }));

                    it( "should calculate zero fees for zero amount", inject(function( feesDelegate, $httpBackend )
                    {
                        var amount = 0.00,
                            result = {
                                fee         : 0,
                                denomination: amount,
                                total       : amount
                            };

                        // Simulate response...
                        $httpBackend
                            .when( "POST",  supplant( urlsGift.FEES.CALCULATE, { amount : amount }) )
                            .respond({
                                responseStatus: "SUCCESS",
                                response      : result
                            });

                        feesDelegate
                            .calculateFee( amount )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.total ).toEqual( amount );
                                expect( response.fee).toEqual( result.fee );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();
                    }));

                    it( "should calculate zero fees for negative denominations", inject(function( feesDelegate, $httpBackend )
                    {
                        var amount = -10.00,
                            result = {
                                fee         : 0,
                                denomination: amount,
                                total       : amount
                            };

                        // Simulate response...
                        $httpBackend
                            .when( "POST",  supplant( urlsGift.FEES.CALCULATE, { amount : amount }) )
                            .respond({
                                responseStatus: "SUCCESS",
                                response      : result
                            });

                        feesDelegate
                            .calculateFee( amount )
                            .then( function( response )
                            {
                                response = extractData(response);

                                expect( response.total ).toEqual( amount );
                                expect( response.fee).toEqual( 0.00 );
                            });

                        // Force a response from mock httpBackend

                        $httpBackend.flush();
                    }));

                });


            });


        });

    });


})( define );


