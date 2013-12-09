/**
 * Angular-Specs
 *
 * This is essentially the angular-mocks.js code with all the decorators
 * for $timeout, $browser, and $httpBackend REMOVED.
 *
 * @author  Thomas Burleson
 * @date    September, 2013
 * @url     https://github.com/Mindspace/bower-angular-specs
 *
 */

angular.mock = { };
/**
 *
 */
angular.mock.$RootElementProvider = function() {
    this.$get = function() {
        return angular.element('<div ng-app></div>');
    }
};

/**
 * @ngdoc overview
 * @name ngMock
 * @description
 *
 * The `ngMock` is an angular module which is used with `ng` module and adds unit-test configuration as well as useful
 * mocks to the {@link AUTO.$injector $injector}.
 */
angular.module('ngMock', ['ng']).provider({
    $rootElement: angular.mock.$RootElementProvider
});

/**
 * Only publish global functions `module()` and `inject()`
 * if AngularJS and (Jasmine or Mocha) have been loaded...
 *
 */

(window.jasmine || window.mocha) && (function(window, angular) {

    var currentSpec = null;

    angular.clearDataCache = function()
    {
        var key,
            cache = angular.element.cache;

        for(key in cache) {
            if (cache.hasOwnProperty(key)) {
                var handle = cache[key].handle;

                handle && angular.element(handle.elem).off();
                delete cache[key];
            }
        }
    };


    beforeEach(function() {
        currentSpec = this;
    });

    afterEach(function() {
        var injector = currentSpec.$injector;

        currentSpec.$injector = null;
        currentSpec.$modules = null;
        currentSpec = null;

        if (injector) {
            injector.get('$rootElement').off();
        }

        angular.clearDataCache();

        // clean up jquery's fragment cache
        angular.forEach(angular.element.fragments, function(val, key) {
            delete angular.element.fragments[key];
        });

        angular.forEach(angular.callbacks, function(val, key) {
            delete angular.callbacks[key];
        });
        angular.callbacks.counter = 0;
    });

    function isSpecRunning() {
        return currentSpec && (window.mocha || currentSpec.queue.running);
    }


    /**
     * @ngdoc function
     * @name angular.mock.module
     * @description
     *
     * *NOTE*: This function is also published on window for easy access.<br>
     *
     * This function registers a module configuration code. It collects the configuration information
     * which will be used when the injector is created by {@link angular.mock.inject inject}.
     *
     * See {@link angular.mock.inject inject} for usage example
     *
     * @param {...(string|Function)} fns any number of modules which are represented as string
     *        aliases or as anonymous module initialization functions. The modules are used to
     *        configure the injector. The 'ng' and 'ngMock' modules are automatically loaded.
     */
    window.module = function() {
        var moduleFns = Array.prototype.slice.call(arguments, 0);
        return isSpecRunning() ? workFn() : workFn;
        /////////////////////
        function workFn() {
            if (currentSpec.$injector) {
                throw Error('Injector already created, can not register a module!');
            } else {
                var modules = currentSpec.$modules || (currentSpec.$modules = []);
                angular.forEach(moduleFns, function(module) {
                    modules.push(module);
                });
            }
        }
    };

    /**
     * @ngdoc function
     * @name angular.mock.inject
     * @description
     *
     * *NOTE*: This function is also published on window for easy access.<br>
     *
     * The inject function wraps a function into an injectable function. The inject() creates new
     * instance of {@link AUTO.$injector $injector} per test, which is then used for
     * resolving references.
     *
     * See also {@link angular.mock.module module}
     *
     * Example of what a typical jasmine tests looks like with the inject method.
     * <pre>
     *
     *   angular.module('myApplicationModule', [])
     *       .value('mode', 'app')
     *       .value('version', 'v1.0.1');
     *
     *
     *   describe('MyApp', function() {
   *
   *     // You need to load modules that you want to test,
   *     // it loads only the "ng" module by default.
   *     beforeEach(module('myApplicationModule'));
   *
   *
   *     // inject() is used to inject arguments of all given functions
   *     it('should provide a version', inject(function(mode, version) {
   *       expect(version).toEqual('v1.0.1');
   *       expect(mode).toEqual('app');
   *     }));
   *
   *
   *     // The inject and module method can also be used inside of the it or beforeEach
   *     it('should override a version and test the new version is injected', function() {
   *       // module() takes functions or strings (module aliases)
   *       module(function($provide) {
   *         $provide.value('version', 'overridden'); // override version here
   *       });
   *
   *       inject(function(version) {
   *         expect(version).toEqual('overridden');
   *       });
   *     ));
   *   });
   *
   * </pre>
   *
   * @param {...Function} fns any number of functions which will be injected using the injector.
     */
    window.inject  = function() {
        var blockFns = Array.prototype.slice.call(arguments, 0);
        var errorForStack = new Error('Declaration Location');
        return isSpecRunning() ? workFn() : workFn;
        /////////////////////
        function workFn() {
            var modules = currentSpec.$modules || [];

            modules.unshift('ngMock');
            modules.unshift('ng');

            var injector = currentSpec.$injector;
            if (!injector) {
                injector = currentSpec.$injector = angular.injector(modules);
            }
            for(var i = 0, ii = blockFns.length; i < ii; i++) {
                try {
                    injector.invoke(blockFns[i] || angular.noop, this);
                } catch (e) {
                    if(e.stack && errorForStack) e.stack +=  '\n' + errorForStack.stack;
                    throw e;
                } finally {
                    errorForStack = null;
                }
            }
        }
    };

})(window, angular);
