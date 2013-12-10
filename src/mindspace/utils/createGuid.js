/**
 * ******************************************************************************************************
 *
 *     createGuid()
 *
 *     Utility function to create dynamic UUIDs
 *
 *  @author     Thomas Burleson
 *  @date       December, 2013
 *
 *
 * ******************************************************************************************************
 */
(function ()
{
    "use strict";

    define(function ()
    {
        function createGuid()
        {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
            {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        return createGuid;
    });

}());
