'use strict';

var modRewrite = require('connect-modrewrite');
var packageConfig = require('./package.json' ).config || {};

module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dev: ['grunt/work/**/*'],
			build: ['grunt/build/**/*'],
			css:['grunt/build/styles/*.css'],
			scripts:['grunt/build/scripts','grunt/build/js/templates.js']
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
					}
				},
				files: {
					'grunt/work/index.html': ['app/index.grunt']
				}
			},
			build: {
				options: {
					data: {
					}
				},
				files: {
					'grunt/build/index.html': ['app/index.grunt']
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

		ngmin: {
			files: {
				src:['grunt/build/js/editor.js'],
				dest:'grunt/build/js/editor.js'
			}
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

		concat: {
			IDMalert: {
				src:  [ 'grunt/build/js/editor.js', '<%= ngtemplates.editor.dest %>' ],
				dest: 'grunt/build/js/editor.js'
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
		},

		php : {
			test: {
			   options: {
				   base: 'server',
				   port: 8010,
				   keepalive: true,
				   open: true
			   }
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
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-php');

	grunt.registerTask('build', [
		'clean:build',
		'sass:build',
		'copy:build',
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

	grunt.registerTask('dev', ['clean:dev', 'sass:dev', 'copy:dev', 'template:dev']);
	grunt.registerTask('default', ['dev', 'connect', 'watch']);

	grunt.registerTask('api', ['php']);


};
