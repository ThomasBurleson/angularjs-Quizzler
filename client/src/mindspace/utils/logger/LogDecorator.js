/**
 * @author      Thomas Burleson
 * @date        November, 2013
 * @copyright   2013 Mindspace LLC.
 *
 * @description
 *
 * Used within AngularJS to decorate/enhance the AngularJS $log service.
 *
 *
 */

(function ()
{
	"use strict";

	var dependencies = ['mindspace/utils/logger/LogEnhancer'];

	/**
	 * Register the class with RequireJS.
	 */
	define(dependencies, function (enhanceLoggerFn)
	{
		/**
		 * Decorate the $log to use inject the LogEnhancer features.
		 *
		 * @param {object} $provide The log console.
		 * @returns {object} promise.
		 * @private
		 */
		var LogDecorator = function ($provide)
		{
			// Register our $log decorator with AngularJS $provider

			$provide.decorator('$log', ["$delegate",
				function ($delegate)
				{
					// NOTE: the LogEnhancer module returns a FUNCTION that we named `enhanceLoggerFn`
					//       All the details of how the `enchancement` works is encapsulated in LogEnhancer!

					enhanceLoggerFn($delegate);

					return $delegate;
				}
			]);
		};

		return [ "$provide", LogDecorator ];
	});

})();
