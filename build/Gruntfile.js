module.exports = function(grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    /**
     * Load in our build configuration file.
     */
    var userConfig = require('./build.config.js');

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {

        /**
         * We read in our `package.json` file so we can access the package name and version. It's already there, so
         * we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled source files. It is first processed
         * as a Grunt template, where the `<%=` pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
                ' * @appName    <%= pkg.name %>\n' +
                ' * @version    <%= pkg.version %>\n' +
                ' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @homepage   <%= pkg.homepage %>\n' +
                ' * @copyright  <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },

         /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            src: [
                '<%= buildDir %>'
            ],
            hooks: [
            ],
            options: {
                force: true
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy our project assets
         * (images, fonts, etc.) and javascripts into `buildDir`, and then to copy the assets to `compileDir`.
         */
        copy: {
            index: {
                files: [
                    {
                        src: '<%= devDir %>/index.html',
                        dest: '<%= buildDir %>/index.html'
                    }
                ]
            },
            build_assets: {
                files: [
                    {
                        src: [ '**', '!less/**' ],
                        cwd: '<%= devDir %>/assets',
                        dest: '<%= buildDir %>/assets/',
                        expand: true
                    }
                ]
            },
            build_appjs: {
                files: [
                    {
                        src: [ '**/*.js' ],
                        cwd: '<%= devDir %>/src',
                        dest: '<%= buildDir %>/src/',
                        expand: true
                    }
                ]
            },
            prod_boot: {
                files: [
                    {
                        src: './requirejs/bootstrap_prod.js',
                        dest: '<%= buildDir %>/assets/js/boot.js',
                        expand: false
                    }
                ]
            },
            dev_boot: {
                files: [
                    {
                        src: './requirejs/bootstrap_dev.js',
                        dest: '<%= buildDir %>/assets/js/boot.js'
                    }
                ]
            },
            build_vendorjs: {
                files: [
                    {
                        src: [ '**' ],
                        cwd: '<%= devDir %>/vendor',
                        dest: '<%= buildDir %>/vendor',
                        expand: true
                    }
                ]
            },
            compile: {
                files: [
                    {
                        src: [ '**' ],
                        cwd: '<%= buildDir %>/assets',
                        dest: '<%= compileDir %>/assets',
                        expand: true
                    },
                    {
                        src: [ '**' ],
                        dest: '<%= compileDir %>/vendor',
                        cwd: '<%= buildDir %>/vendor',
                        expand: true
                    }
                ]
            }
        },

        /**
         * `grunt concat` concatenates multiple source files into a single file.
         */
        concat: {

            /**
             * The `source` target is the concatenation of our application source code and all specified vendor
             * source code into a single file.
             */
            source: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                src: [
                    '<%= buildDir %>/assets/js/quizzler.js'
                ],
                dest: '<%= buildDir %>/assets/js/quizzler.js'
            }
        },


        /**
         * `jshint` defines the rules of our linter as well as which files we should check. This file, all javascript
         * sources, and all our unit tests are linted based on the policies listed in `options`. But we can also
         * specify exclusionary patterns by prefixing them with an exclamation point (!); this is useful when code comes
         * from a third party but is nonetheless inside `src/`.
         */
        jshint: {
            src: [
                '<%= appFiles.js %>'
            ],
            test: [
                '<%= appFiles.jsunit %>'
            ],
            scenario: [
                '<%= appFiles.jsscenario %>'
            ],
            gruntfile: [
                'Gruntfile.js'
            ],
            options: {
                curly: true,
                immed: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true
            },
            globals: {}
        },

        /**
         * Minifies RJS files and makes it production ready
         * Build files are minified and encapsulated using RJS Optimizer plugin
         */
        requirejs: {
            compile: {
                options: {
                    baseUrl: "../client/src",
                    paths   :
                    {
                        // Configure alias to full paths; relative to `baseURL`

                        'auth'         : './quizzer/authentication',
                        'quiz'         : './quizzer/quiz',
                        'utils'        : './mindspace/utils'

                    },
                    out: '<%= buildDir %>/assets/js/quizzler.js',
                    name: 'main'

                },
                preserveLicenseComments : false,
                optimize: "uglify"
            }
        }

    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Register Tasks
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    grunt.registerTask("dev", [
        'clean:src',
        'copy:build_assets',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'copy:dev_boot',
        'copy:index'

    ]);

    grunt.registerTask( "prod", [
        'clean:src',
        'copy:build_assets',
        'copy:build_vendorjs',
        'copy:prod_boot',
        'copy:index',
        "requirejs",
        "concat:source"
    ]);


    function stripBanner( src ) {
        var m = [
                '(?:.*\\/\\/.*\\r?\\n)*\\s*',   // Strip // ... leading banners.
                '\\/\\*[\\s\\S]*?\\*\\/'        // Strips all /* ... */ block comment banners.
            ],
            re = new RegExp('^\\s*(?:' + m.join('|') + ')\\s*', '');

        return src.replace(re, '', "gm");
    };
};
