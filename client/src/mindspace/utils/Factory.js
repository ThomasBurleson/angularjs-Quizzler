/**
 * @author      Thomas Burleson
 * @date        November, 2013
 * @description
 *
 *  Factory.instanceOf( )
 *
 *  Typically developers allow AngularJS to construct instances with injected parameters.
 *  Some scenarios however force developers to manually create instances from the object registered with
 *  RequireJS define()... these objects are `Construction Arrays`.
 *
 *  This utility function is useful to extract the constructor function from the `array`
 *  and quickly build an instance with any specified arguments.
 *
 */
(function ()
{
    "use strict";

    define(function ()
    {
        /**
         * Internal util to slice arguments into a list of dependent modules
         */

        function sliceArgs(args, startIndex)
        {
            return [].slice.call(args, startIndex || 0);
        }

        /**
         * Find the construction function in the array (last element)
         */

        function extractFrom(target)
        {
            if(angular.isArray(target))
            {
                target = target[target.length - 1];
            }
            return target;
        }

        /**
         * Extract to instantiate with a constructor function or array; may
         * also specify optional arguments to be passed to the constructor function.
         */
        var createInstanceOf = function ()
        {
            var params = sliceArgs(arguments),
                Constructor = extractFrom(params.shift());

            if(angular.isFunction(Constructor))
            {
                return Constructor.length > 0 ? Constructor.apply(undefined, params) : new Constructor();

            }
            else
            {

                throw new Error("Specified target is not a constructor function or constructor array");
            }

        };

        // Publish this `construction-function` extractor

        return {
            instanceOf: createInstanceOf
        };

    });

}());
