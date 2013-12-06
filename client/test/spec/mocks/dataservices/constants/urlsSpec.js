/**
 *   
 *  This URLConstants module uses RequireJS to `define` a AngularJS constructor function
 *  with its dependencies.
 *
 *  @author  Thomas Burleson
 *  @website www.gridlinked.info
 *
 *  @date    August, 2013
 *
 */
(function( define ) {
    "use strict";

    /**
     * Define dependencies of code used internally by URLConstants
     * @type {Array}
     */
    var dependencies = [
        'quizzer/dataservices/constants/urls',
        'quizzer/utils/supplant'
    ];

    /**
     * Register the URLConstants class with RequireJS
     */
    define( dependencies, function( URLConstants, supplant ) {

        describe("Tests URLs for Dataservices", function () {

            var TEST_ROOT       = 'http://localhost:8080',
                setDelegateRoot = null;

            // ******************************************************
            // Setup/Teardown  Methods
            // ******************************************************

            /**
             * Load the `test module`
             */
            beforeEach( function()
            {
                module( 'test.quizzer.Dataservices' );
            });

            /**
             * Configure disposable module with values and factories
             */
            beforeEach( module( function( $provide )
            {

                $provide.value( 'urls',  URLConstants.delegates );

                // Alias reference for testing purposes...
                setDelegateRoot = URLConstants.setDelegateRoot;
                setDelegateRoot( TEST_ROOT );

            }));


            // **********************************************
            // TestSuite for Authentication URLS
            // **********************************************

            describe( "Tests URLs for Authentication", function()
            {

                it( "Logout URL should be valid", inject( function ( urls )
                {
                    expect( urls.AUTHENTICATION.LOGOUT ).toEqual(
                        supplant( "{0}/auth/pub/logout", [ TEST_ROOT ])
                    );

                }));

                it( "New root should update Logout URL to be valid", inject( function ( urls )
                {
                    var root2 = "https://data.quizzer.com";

                    setDelegateRoot( root2 );

                    expect( urls.AUTHENTICATION.LOGOUT ).toEqual(
                        supplant( "{0}/auth/pub/logout", [ root2 ])
                    );

                }));
            });

            // **********************************************
            // TestSuite for GiftItems URLS
            // **********************************************

            describe( "Tests URLs for GiftItems", function()
            {

                it( "Gift Item search URL should be valid", inject( function ( urls )
                {
                    var data    = {
                            root         : TEST_ROOT,
                            catGroupCode : 'Search',
                            catCode      : 'GOOGLE'
                        },
                        desired = supplant( "{root}/giftitems/pub/categorygroupcode/{catGroupCode}/categorycode/{catCode}", data );

                    expect( supplant( urls.GIFT.ITEMS.LIST_BY_GROUPCAT, data ) ).toEqual( desired );

                }));

            });

            // **********************************************
            // TestSuite for GiftItems URLS
            // **********************************************

            describe( "Tests URLs for Gift Fees", function()
            {

                it( "Gift Fee Filter search URL should be valid", inject( function ( urls )
                {
                    var data    = {
                            root            : TEST_ROOT,
                            amount          : '30.00',
                            transactionType : 'CreditCard'
                        },
                        desired = supplant( "{root}/giftfees/pub/denomination/{amount}/transactiontype/{transactionType}", data );

                    expect( supplant( urls.GIFT.FEES.FILTER, data ) ).toEqual( desired );

                }));

            });


            // **********************************************
            // TestSuite for Gift Action URLS
            // **********************************************

            describe( "Tests URLs for Gift Actions", function()
            {

                it( "Gift Action URLs should be valid", inject( function ( urls )
                {
                    var data    = {
                            root    : TEST_ROOT,
                            value   : '37.75',
                            type    : 'STOCK'
                        },
                        desired = supplant( "{root}/gift/pub/cost/{value}/transaction/{type}", data );

                    expect( supplant( urls.GIFT.ACTIONS.CALCULATE_COST, data ) ).toEqual( desired );

                }));

            });


        });

    });


}( define ));
