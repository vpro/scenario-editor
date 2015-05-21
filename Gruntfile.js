'use strict';

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {

	var packageConfig = grunt.file.readJSON('package.json') || {};

	grunt.initConfig({

		pkg: packageConfig,

		clean: {
			dev: ['grunt/work/**/*'],
			build: ['grunt/build/**/*'],
			css:['grunt/build/styles/*.css'],
			scripts:['grunt/build/scripts','grunt/build/js/templates.js']
		},

		concat: {
			IDMalert: {
				src:  [ 'grunt/build/js/editor.js', '<%= ngtemplates.editor.dest %>' ],
				dest: 'grunt/build/js/editor.js'
			}
		},

		connect: {
			server: {
				options: {
					hostname: '*',
					tmpdir: 'grunt/work',
					middleware: function(connect) {
						return [
							connect.static(require('path').resolve('stub')),
							connect.static(require('path').resolve('grunt/work')),
							connect.static(require('path').resolve('app')),
							connect.static(require('path').resolve('resources'))
						]
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
						src:['*.css'],
						expand:true,
						dest:'grunt/build/styles/'
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
			},
			deploy: {
				files: [{
					cwd:'grunt/build',
					src:['**/*'],
					expand:true,
					dest:'../web'
				}]
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
						'DATA_SERVER' : packageConfig.config.production.dataServer,
						'ASSET_ROOT' : packageConfig.config.production.assetRoot
					}
				}
			},

			dev: {
				options: {
					constants: {
						'JS_SERVER' : packageConfig.config.dev.jsServer,
						'DATA_SERVER' : packageConfig.config.dev.dataServer,
						'ASSET_ROOT' : packageConfig.config.dev.assetRoot
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
				   base: 'server',
				   port: 8010,
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
						apiServer :  '<%= pkg.config.dev.apiServer %>'
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
						allowFileWrites :  true
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
						apiServer :  '<%= pkg.config.production.apiServer %>'
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
						allowFileWrites :  false
					}
				},
				files: {
					'server/default-config.php': ['server/default-config.template.php']
				}
			},
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
		'copy:build',
		'ngconstant:build',
		'template:build',
		'useminPrepare',
		'concat:generated',
		'clean:css',
		'cssmin:generated',
		'usemin',
		'ngmin',
		'ngtemplates',
		'concat:IDMalert',
		'uglify',
		'clean:scripts',
		'copy:deploy'
	]);

	grunt.registerTask('dev', ['clean:dev', 'sass:dev', 'copy:dev', 'ngconstant:dev', 'template:dev']);
	grunt.registerTask('default', ['dev', 'connect', 'watch']);

	/* run the dataserver as a seperate task in dev mode to be able to run the watch task in parallel */
	grunt.registerTask('dataserver:dev', ['template:devServer','php']);
	grunt.registerTask('dataserver:build', ['template:buildServer','php']);


};
