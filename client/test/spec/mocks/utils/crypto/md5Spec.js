/**
 * Jasmine Tests for the md5 Cryptographic class
 *
 * @author Thomas Burleson
 *
 */
(function( define, describe ){
    "use strict";

    var dependencies = [
        'quizzer/utils/crypto/md5',
    ];

    /**
     * Register dependencies of `Session` for the TestSuite, then build
     * the test suite with its tests and expectations.
     *
     */
    define( dependencies, function ( Crypto )
    {

        describe( "Tests for `md5` Crypto class", function()
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
            });

            /**
             * Configure disposable module with values and factories
             */
            beforeEach( module( function( $provide )
            {
                $provide.factory( 'md5',   Crypto );


            }));

            it( "md5::encrypt() should work", inject( function ( md5 )
            {
                expect( md5.encrypt( 'hello' ))          .toEqual( '5d41402abc4b2a76b9719d911017c592' );
                expect( md5.encrypt( '6cext6bH%q]W=x' )) .toEqual( '75b10c30a205c8382920145f61923254' );
            }));



        });

    });


})( define, describe );


