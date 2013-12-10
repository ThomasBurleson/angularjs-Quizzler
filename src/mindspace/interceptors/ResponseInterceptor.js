/**
 * @author      Thomas Burleson
 * @date        September 15, 2013
 * @copyright   2013 Mindspace, LLC
 *
 * @description
 * Establishes global response interceptors and potential routing based on DataService responses
 *
 */
(function ()
{
    "use strict";

    define(function ()
    {
        var errorModel = null,
            logger = null,
            $scope = null,
            $$q = null;

        /**
         * Constructor function for the ResponseInterceptor.
         */
        var ResponseInterceptor = function ($httpProvider)
        {
            /**
             *   Only RESPONSE interceptors are implemented below.
             *   These interceptors receive and return promises.
             *   NOTE: We have not yet implemented REQUEST interceptors/transforms !
             */
            var globalResponseInterceptor = function (promise)
                {
                    var onSuccess = function (packet)
                    {
                        // Routing by-pass
                        // !! ngRoutes will load templateUrls as strings...

                        if(angular.isString(packet.data))
                        {
                            return packet;
                        }

                        logger.debug("onSuccess()");

                        // Here we can check status codes, etc.
                        // and then extract the `true` data body

                        return packet;

                    },
                    /**
                     * FaultHandler
                     */
                    onFault = function (fault)
                    {
                        logger.debug("onFault({status})", fault);

                        var error = angular.isDefined(fault.error) ? fault.error :
                            angular.isDefined(fault.status) ?
                            {
                                code: fault.status,
                                message: "Unexpected Server Error"
                        } :
                        {
                            code: "404",
                            message: "Not Found"
                        };

                        // Extract error and `report` via updates to the `errorModel`
                        return $$q.reject(error);
                    };

                    return promise.then(onSuccess, onFault);
                },
                /**
                 * Capture the injected instances and return our global ResponseInterceptor
                 * @returns {Function}
                 */
                registerInterceptor = function (session, $rootScope, $q, $log)
                {
                    // Save references; required for interceptor features

                    $$q = $q;
                    logger = $log.getInstance("ResponseInterceptor");
                    $scope = $rootScope;
                    errorModel = session.error;

                    return globalResponseInterceptor;
                };


            /**
             * Register global HTTP response interceptor
             */
            $httpProvider.responseInterceptors.push(
                ["session", "$rootScope", "$q", "$log", registerInterceptor ]
            );

        };

        return ["$httpProvider", ResponseInterceptor];
    });

}());
