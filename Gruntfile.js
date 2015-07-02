'use strict';

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {

	var packageConfig = grunt.file.readJSON('package.json') || {};

	grunt.initConfig({

		pkg: packageConfig,

		clean: {
			dev: ['grunt/work/**/*'],
			build: ['grunt/build/**/*'],
			css:['grunt/build/styles/*.css', 'grunt/build/styles/twitter-bootstrap'],
			scripts:['grunt/build/scripts','grunt/build/js/templates.js']
		},

		concat: {
			templates: {
				src:  [ 'grunt/build/js/editor.js', '<%= ngtemplates.editor.dest %>' ],
				dest: 'grunt/build/js/editor.js'
			}
		},

		connect: {
			dev: {
				options: {
					hostname: '*',
					port: '8081',
					middleware: function(connect) {
						return [
							connect.static(require('path').resolve('stub')),
							connect.static(require('path').resolve('grunt/work')),
							connect.static(require('path').resolve('app'))
						];
					}
				}
			},

			build: {
				options: {
					hostname: '*',
					keepalive: true,
					middleware: function(connect) {
						return [
							connect.static(require('path').resolve('grunt/build'))
						];
					}
				}
			}
		},

		copy: {
			dev: {
				files: [
					{
						cwd:'app/styles',
						src:['*.css'],
						expand:true,
						dest:'grunt/work/styles/'
					}
				]
			},
			build: {
				files: [
					{
						cwd:'app/styles',
						src:['*.css', 'twitter-bootstrap/bootstrap.min.css'],
						expand:true,
						dest:'grunt/build/styles/'
					},
					{
						cwd:'app/styles',
						src:['fonts/*'],
						expand:true,
						dest:'grunt/build/'
					},
					{
						cwd:'app',
						src:['img/*'],
						expand:true,
						dest:'grunt/build/'
					},
					{
						cwd:'app/scripts',
						src:['**/*.js'],
						expand:true,
						dest:'grunt/build/scripts'
					}
				]
			},
			js: {
				files: [
					{
						src:['.tmp/concat/js/app.js'],
						dest:'grunt/build/js/app.js'
					}
				]
			}
		},

		ngconstant : {

			options : {
				name: 'SE',
                deps: false,
				dest: 'app/scripts/editor/constants.js'
			},

			build: {
				options: {
					constants: {
						'JS_SERVER' : packageConfig.config.production.jsServer,
						'DATA_SERVER' : packageConfig.config.production.dataServer
					}
				}
			},

			dev: {
				options: {
					constants: {
						'JS_SERVER' : packageConfig.config.dev.jsServer,
						'DATA_SERVER' : packageConfig.config.dev.dataServer
					}
				}
			}
		},

		ngmin: {
			files: {
				src:['grunt/build/js/editor.js'],
				dest:'grunt/build/js/editor.js'
			}
		},

		ngtemplates: {
			editor: {
				options: {
					module: 'editor',
					htmlmin: {
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true,
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
					}
				},
				cwd:'app',
				src: 'views/**/*.html',
				dest: 'grunt/build/js/templates.js'
			}
		},

		php : {
			test: {
			   options: {
				   hostname: '0.0.0.0',
				   base: 'server',
				   port: 8082,
				   keepalive: true,
				   open: false
			   }
		   }
		},

		sass: {
			dev: {
				options: {
					style: 'expanded',
					sourcemap:'none',
					debugInfo: true
				},
				files: {
					'grunt/work/styles/main.css':'app/styles/main.scss'
				}
			},
			build: {
				options: {
					style: 'compressed',
					sourcemap:'none',
					debugInfo: false
				},
				files: {
					'grunt/build/styles/main.css':'app/styles/main.scss'
				}
			}
		},

		template: {
			dev: {
				options: {
					data: {
						jsserver : '<%= pkg.config.dev.jsServer %>',
						dataServer :  '<%= pkg.config.dev.dataServer %>'
					}
				},
				files: {
					'grunt/work/index.html': ['app/index.grunt']
				}
			},

			devServer: {
				options: {
					data: {
						basePath : '',
						allowRelativeFileWrites :  true
					}
				},
				files: {
					'server/default-config.php': ['server/default-config.template.php']
				}
			},

			build: {
				options: {
					data: {
						jsserver : '<%= pkg.config.production.jsServer %>',
						dataServer :  '<%= pkg.config.production.dataServer %>'
					}
				},
				files: {
					'grunt/build/index.html': ['app/index.grunt']
				}
			},

			buildServer: {
				options: {
					data: {
						basePath : '',
						allowRelativeFileWrites :  false
					}
				},
				files: {
					'server/default-config.php': ['server/default-config.template.php']
				}
			}
		},

		useminPrepare: {
			html: 'grunt/build/index.html',
			options: {
				dest: 'grunt/build',
				flow: {
					steps: {
						'js':['concat'],
						'css':['concat','cssmin']
					},
					post:{}
				}
			}
		},

		usemin: {
			html: ['grunt/build/{,*/}*.html'],
			css: ['grunt/build/styles/{,*/}*.css']
		},

		uglify: {
			options: {
				mangle:true,
				compress:true
			},
			files: {
				src:['grunt/build/js/editor.js'],
				dest:'grunt/build/js/editor.js'
			}
		},

		watch: {
			sass: {
				files: ['app/styles/{,*/}*.{scss,sass}'],
				tasks: ['sass:dev']
			},
			template: {
				files: ['app/index.grunt'],
				tasks: ['template:dev']
			},
            css: {
                files: ['app/styles/{,*/}*.css'],
                tasks: ['copy:dev']
            }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-ng-constant');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-php');

	grunt.registerTask('build', [
		'clean:build',
		'sass:build',
		'ngconstant:build',
		'copy:build',
		'template:build',
		'template:buildServer',
		'useminPrepare',
		'concat:generated',
		'clean:css',
		'cssmin:generated',
		'usemin',
		'ngmin',
		'ngtemplates',
		'concat:templates',
		'uglify',
		'clean:scripts'
	]);

		// for testing against the build settings
	grunt.registerTask('test:build', ['build', 'connect:build']);

	grunt.registerTask('dev', ['clean:dev', 'sass:dev', 'ngconstant:dev', 'copy:dev', 'template:dev']);
	grunt.registerTask('dev:watch', ['dev', 'connect:dev', 'watch']);


	grunt.registerTask('default', ['dev:watch']);


	// run the dataserver as a seperate task in dev mode to be able to run the watch task in parallel
	grunt.registerTask('dataserver:dev', ['template:devServer','php']);


		// dataserver:build creates a deployable version of the server/ folder
	grunt.registerTask('dataserver:build', ['template:buildServer']);


};
