module.exports = function(grunt) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-html2js');
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
		 * Increments the version number, etc.
		 */
		bump: {
			options: {
				files: [
					"package.json",
					"bower.json"
				],
				commit: false,
				commitMessage: 'chore(release): v%VERSION%',
				commitFiles: [
					"package.json",
					"client/bower.json"
				],
				createTag: false,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'origin'
			}
		},

		/**
		 * The directories to delete when `grunt clean` is executed.
		 */
		clean: {
			src: [
				'<%= buildDir %>',
				'<%= compileDir %>'
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
			build_assets: {
				files: [
					{
						src: [ '**', '!less/**' ],
						dest: '<%= buildDir %>/assets/',
						cwd: '<%= srcDir %>/src/assets',
						expand: true
					}
				]
			},
			build_appjs: {
				files: [
					{
						src: [ '**/*.js' ],
						dest: '<%= buildDir %>/src/',
						cwd: '<%= srcDir %>/src',
						expand: true
					},
                    {
                        src: [ '**/*.js', '**/*.html' ],
                        dest: '<%= buildDir %>/test/',
                        cwd: '<%= srcDir %>/test/live',
                        expand: true
                    }
				]
			},
			build_vendorjs: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= buildDir %>/vendor',
						cwd: '<%= srcDir %>/vendor',
						expand: true
					}
				]
			},
			build_libs: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= buildDir %>/vendor',
						cwd: '<%= srcDir %>/libs',
						expand: true
					}
				]
			},
			compile: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= compileDir %>/assets',
						cwd: '<%= buildDir %>/assets',
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
			 * The `compile_js` target is the concatenation of our application source code and all specified vendor
			 * source code into a single file.
			 */
			compile_js: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: [
					'<%= vendorFiles.js %>',
					'module.prefix',
					'<%= buildDir %>/src/**/*.js',
					'<%= html2js.app.dest %>',
					'<%= vendorFiles.js %>',
					'module.suffix'
				],
				dest: '<%= compileDir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
			},

			/**
			 * The `templates` target is the concatenation of our application source code and all specified vendor
			 * source code into a single file.
			 */
			templates: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: [
					'require.module.prefix',
					'<%= html2js.app.dest %>',
					'require.module.suffix'
				],
				dest: '<%= html2js.app.dest %>'
			}

		},

		/**
		 * `ng-min` annotates the sources before minifying. That is, it allows us to code without the array syntax.
		 */
		ngmin: {
			compile: {
				files: [
					{
						src: [ '<%= appFiles.js %>' ],
						cwd: '<%= buildDir %>',
						dest: '<%= buildDir %>',
						expand: true
					}
				]
			}
		},

		/**
		 * Minify the sources!
		 */
		uglify: {
			compile: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
				}
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
		 * HTML2JS is a Grunt plugin that takes all of your template files and
		 * places them into JavaScript files as strings that are added to
		 * AngularJS's template cache. This means that the templates too become
		 * part of the initial payload as one JavaScript file. Neat!
		 */
		html2js: {
			/**
			 * These are the templates from `src/assets/views`.
			 */
			app: {
				options: {
					base: '<%= srcDir %>/assets/views',
					module: '<%= htmlTemplateName %>'
				},
				src: [ '<%= appFiles.templates %>' ],
				dest: '<%= buildDir %>/src/<%= htmlTemplateName %>.js'
			}
		},

		/**
         * Minifies RJS files and makes it production ready
         * Build files are minified and encapsulated using RJS Optimizer plugin
         */
        requirejs: {
            mod: {
                options: {
                    baseUrl : '<%= buildDir %>/src',
                    dir: '<%= compileDir %>/src/',
                    modules: [
                        {   name: 'quizzer/authentication/AuthenticationModule'     },
                        {   name: 'quizzer/quiz/QuizModule'                         }
                    ],
                    optimizeCss : "none",
                    preserveLicenseComments : false,
                    uglify: {
                        mangle: false
                    }
               }
            }
        },

		/**
		 * The `index` task compiles the `index.html` file as a Grunt template. CSS
		 * and JS files co-exist here but they get split apart later.
		 */
		index: {

			/**
			 * During development, we don't want to have wait for compilation, concatenation, minification, etc. So to
			 * avoid these steps, we simply add all script files directly to the `<head>` of `index.html`. The
			 * `src` property contains the list of included files.
			 */
			build: {
				dir: '<%= buildDir %>',
				src: [
					'<%= vendorFiles.js %>',
					'<%= buildDir %>/src/**/*.js',
					'<%= html2js.app.dest %>',
					'<%= vendorFiles.css %>',
					'<%= recess.build.dest %>'
				]
			},

			/**
			 * When it is time to have a completely compiled application, we can alter the above to include only a
			 * single JavaScript and a single CSS file. Now we're back!
			 */
			compile: {
				dir: '<%= compileDir %>',
				src: [
					'<%= concat.compile_js.dest %>',
					'<%= vendorFiles.css %>',
					'<%= recess.compile.dest %>'
				]
			}
		}

	};

	grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Register Tasks
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    grunt.registerTask("gh-pages", [
        'copy:build_assets',
        'copy:build_appjs',
        'copy:build_vendorjs',
        'copy:build_libs',
    ]);

	/**
	 * The default task is to build and compile.
	 */
	grunt.registerTask('default', [ 'build', 'compile' ]);

	/**
	 * The `build` task gets your app ready to run for development and testing.
	 */
	grunt.registerTask('build', [
		'clean:src',
		'html2js',
		'concat:templates',
		'jshint',
		'copy:build_assets',
		'copy:build_appjs',
		'copy:build_vendorjs',
		'copy:build_libs',
		'index:build'
	]);

	/**
	 * The `compile` task gets your app ready for deployment by concatenating and minifying your code.
	 */
	grunt.registerTask('compile', [
        'build',
		'ngmin',
		'copy:compile',
		'requirejs',
		'index:compile'
	]);

	/**
	 * QA task would be used to validate the changes of both dev and production builds
	 */
	grunt.registerTask('qa',['compile','server']);

	/**
	 * The index.html template includes the stylesheet and javascript sources
	 * based on dynamic names calculated in this Gruntfile. This task assembles
	 * the list into variables for the template to use and then runs the
	 * compilation.
	 */
	grunt.registerMultiTask('index', 'Process index.html template', function() {
		var dirRE = new RegExp('^(' + grunt.config('buildDir') + '|' + grunt.config('compileDir') + ')\/', 'g');
		var jsFiles = filterForJS(this.filesSrc).map(function(file) {
			return file.replace(dirRE, '');
		});
		var cssFiles = filterForCSS(this.filesSrc).map(function(file) {
			return file.replace(dirRE, '');
		});
		var dev = this.target === 'build';

		grunt.file.copy('../client/src/index.html', this.data.dir + '/index.html', {
			process: function(contents, path) {
				return grunt.template.process(contents, {
					data: {
						scripts: jsFiles,
						styles: cssFiles,
						version: grunt.config('pkg.version'),
						dev: dev
					}
				});
			}
		});
	});

	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Utility Functions
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Function takes any number of arguments. It can be used to merge objects and makes deep copies of
	 * values. However, first argument is given by reference.
	 *
	 * @returns {*}
	 */
	function merge() {

		/**
		 * Determines if an object is valid.
		 *
		 * @param {Object} obj The object being checked for validity.
		 * @returns {boolean} Boolean value indicating if the object is valid.
		 * @private
		 */
		var _isValidObject = function(obj) {
			return ( (typeof obj !== 'object') || (obj === null) );
		};

		/**
		 * Inner function that merges two object and their properties.
		 *
		 * @param {Object} dst The destination object that contains the merged properties.
		 * @param {Object} src The source object that's being merged into the destination object.
		 * @returns {*} The final, merged object; aka the destination object.
		 * @private
		 */
		var _mergeObjects = function(dst, src) {
			if(_isValidObject(src)) {
				return dst;
			}

			for(var p in src) {
				if(!src.hasOwnProperty(p)) {
					continue;
				}
				if(src[p] === undefined) {
					continue;
				}
				if(_isValidObject(src[p])) {
					dst[p] = src[p];
				} else if(_isValidObject(dst[p])) {
					dst[p] = _mergeObjects(src[p].constructor === Array ? [] : {}, src[p]);
				} else {
					_mergeObjects(dst[p], src[p]);
				}
			}
			return dst;
		};

		// Loop through arguments and merge them into the first argument.
		var out = arguments[0];
		if(_isValidObject(out)) {
			return out;
		}
		for(var i = 1, il = arguments.length; i < il; i++) {
			_mergeObjects(out, arguments[i]);
		}
		return out;
	}

	/**
	 * Utility function to detect browser param for unit test
	 */
	function updateUnitBrowserConfig() {
		var acceptibleBrowsersArr = ["IE", "Chrome", "Firefox", "ChromeCanary", "Opera", "Safari", "PhantomJS"];
		if(grunt.option("unit:browsers")) {

			var currentContinuousConfig = grunt.config.get("karma.continuous");
			var currentUnitConfig = grunt.config.get("karma.unit");
			var browserArr = grunt.option("unit:browsers").split(",");
			var checkedBrowserArr = [];
			for(var i = 0; i < browserArr.length; i++) {
				if(acceptibleBrowsersArr.indexOf(browserArr[i]) >= 0) {
					checkedBrowserArr.push(browserArr[i]);
				}
				else {
					grunt.log.writeln("Not a valid browser " + browserArr[i]);
					grunt.log.writeln("Use one of these option " + acceptibleBrowsersArr.join(", "));
				}
			}

			if(checkedBrowserArr.length > 0) {
				grunt.log.writeln("Browser(s) to be used for unit tests are :" + checkedBrowserArr.join(", "));
				currentContinuousConfig.browsers = checkedBrowserArr;
				grunt.config.set("karma.continuous", currentContinuousConfig);
				currentUnitConfig.browsers = checkedBrowserArr;
				grunt.config.set("karma.unit", currentUnitConfig);
			}
		}
	}

	/**
	 * A utility function to get all app JavaScript sources.
	 */
	function filterForJS(files) {
		return files.filter(function(file) {
			return file.match(/\.js$/);
		});
	}

	/**
	 * A utility function to get all app CSS sources.
	 */
	function filterForCSS(files) {
		return files.filter(function(file) {
			return file.match(/\.css$/);
		});
	}

	/**
	 * Adding custom tasks from tasks folder
	 */
	grunt.loadTasks('tasks');
};
