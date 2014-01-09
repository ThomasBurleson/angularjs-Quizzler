/**
 * @author      Thomas Burleson
 * @date        November, 2013
 *
 * @description
 *
 *  Uses LogEnhancer functionality to publish instance
 *
 */
(function ()
{
    "use strict";

    define([
            "utils/logger/LogEnhancer",
            "utils/BrowserDetect"
        ],
        function (LogEnhancer, BrowserDetect)
        {
            /**
             * Determines if the requested console logging method is available, since it is not with IE.
             *
             * @param {Function} method The request console logging method.
             * @returns {object} Indicates if the console logging method is available.
             * @private
             */
            var prepareLogToConsole = function (method)
            {
                var console = window.console,
                    isFunction = function (fn)
                    {
                        return(typeof (fn) == typeof (Function));
                    },
                    isAvailableConsoleFor = function (method)
                    {
                        var isPhantomJS = BrowserDetect.browser != "PhantomJS";

                        // NOTE: Tried using this for less logging in the console/terminal, but then logging in IDE is
                        // wiped out as well return console && console[method] && isFunction(console[method]) && isPhantomJS;

                        return console && console[method] && isFunction(console[method]);
                    },
                    logFn = function (message)
                    {
                        if(isAvailableConsoleFor(method))
                        {
                            try
                            {
                                console[method](message);

                            }
                            catch(e)
                            {}
                        }
                    };

                return logFn;
            },
                $log = {
                    log  : prepareLogToConsole("log"),
                    info : prepareLogToConsole("info"),
                    warn : prepareLogToConsole("warn"),
                    debug: prepareLogToConsole("debug"),
                    error: prepareLogToConsole("error")
                };

            // Publish instance of $log simulator; with enhanced functionality
            return new LogEnhancer($log);
        });

})();
