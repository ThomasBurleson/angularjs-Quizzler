/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {

    devDir      : "../client",
    buildDir    : "../bin",
    compileDir  : "../deploy",

    appFiles: {

        js: [
            "../client/src/**/*.js"
        ],

        jsunit: [
            "../client/test/**/*Spec.js",
            "../client/test/*.js"
        ],

        jsscenario: [
            "../client/test/**/*Scenario.js",
            "../client/test/*.js"
        ],

        templates : [
            "../client/src/assets/views/**/*.tpl.html"
        ],

        html: [
            "../client/src/index.html"
        ],

        css : [
            "../client/assets/css/bootstrap.css",
            "../client/assets/css/monokai.css"
        ],

        less: "../client/src/assets/less/main.less"
    },

    /**
     * The compiled HTML template JavaScript file as well as the name of the template angular module.
     */
    htmlTemplateName: "HTMLTemplateModule",

    /**
     * This is the same as `appFiles`, except it contains patterns that reference vendor code (`vendor/`) that we
     * need to place into the build process somewhere. While the `appFiles` property ensures all standardized files
     * are collected for compilation, it is the user's job to ensure non-standardized (i.e. vendor-related) files are
     * handled appropriately in `vendorFiles.js`.
     *
     * The `vendorFiles.js` property holds files to be automatically concatenated and minified with our project source
     * files.
     *
     * The `vendorFiles.css` property holds any CSS files to be automatically included in our app.
     */
    vendorFiles: {
        js: [
            "../client/vendor/angular/angular.js",
            "../client/vendor/angular-route/angular-route.js",
            "../client/vendor/angular-sanitize/angular-sanitize.js",
            "../client/vendor/headjs-notify/src/load.js",
            "../client/vendor/require/require.js",
            "../client/vendor/requirejs-text/text.js",
            "../client/vendor/underscore.js",
            "../client/vendor/highlightjs/highlight.pack.js"
        ],
        css: [
        ]
    },

    /**
     * Defines server ports for local, static web server and karma servers.
     */
    ports: {
        webServer: {
            build : 8890,
            compile: 8888
        },
        karma: {
            unit: {
                runnerPort: 9101,
                port: 9877
            }
        }
    }
};
