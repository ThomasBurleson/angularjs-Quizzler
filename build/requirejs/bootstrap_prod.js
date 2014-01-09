/**
 *  Use aysnc script loader, configure the application module (for AngularJS)
 *  and initialize the application ( which configures routing )
 *
 *  @author Thomas Burleson
 */

 (function( window, head ) {
    "use strict";

    head.js(

      // Pre-load these for splash-screen progress bar...

      { require    : "./vendor/requirejs/require.js",                  size: "80196"   },
      { underscore : "./vendor/underscore/underscore.js",              size: "43568"   },

      { angular    : "./vendor/angular/angular.js",                    size: "551057"  },
      { ngRoute    : "./vendor/angular-route/angular-route.js",        size: "30052"   },
      { ngSanitize : "./vendor/angular-sanitize/angular-sanitize.js",  size: "19990"   },

      { quizzler   : "./assets/js/quizzler.js"                                         }

    )
    .ready("ALL", function()
    {
        // All application code is concat/uglified in 1 file:  `quizzler.js`

        require( [ "main" ], function( app )
        {
            // Application has bootstrapped and started...
        });


    });



}( window, head ));
