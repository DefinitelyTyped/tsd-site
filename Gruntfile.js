'use strict';

module.exports = function (grunt) {

	var gtx = require('gruntfile-gtx').wrap(grunt);
	gtx.loadAuto();

	gtx.config({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: gtx.readJSON('.jshintrc', {
				reporter: './node_modules/jshint-path-reporter'
			}),
			all: ['Gruntfile.js', 'tasks/**/*.js', 'test/*.js', 'app/**/*.js', 'lib/**/*.js']
		},
		clean: {
			tmp: ['tmp/**/*', 'test/tmp/**/*'],
			dist: ['dist/**/*'],
			dump: ['test/**/dump']
		},
		less: {
			build: {
				options: {},
				files: {
					'dist/css/build.css': [
						'src/css/build.less'
					]
				}
			}
		},
		browserify: {
			options: {
				bundleOptions: {
					// weird
					// debug: true
				}
			},
			vue: {
				options: {
					require: ['vue']
				},
				files: {
					'dist/js/vue.js': []
				}
			},
			index: {
				options: {
					external: ['vue', 'oboe']
				},
				files: {
					'dist/js/index.js': ['src/js/index.js']
				}
			}
		}
	});

	gtx.alias('assemble:copy', [
		{
			src: 'node_modules/oboe/dist/oboe-browser.min.js',
			dest: 'dist/js/oboe.js'
		},
		{
			src: 'bower_components/bootstrap/dist/js//bootstrap.min.js',
			dest: 'dist/js/bootstrap.js'
		},
		{
			expand: true,
			src: '*.*',
			cwd: 'bower_components/bootstrap/dist/fonts',
			dest: 'dist/fonts/'
		},
		{
			expand: true,
			src: '*.*',
			cwd: 'data',
			dest: 'dist/data/'
		},
		{
			expand: true,
			src: ['*.html', '*.md', 'js/**/*.js'],
			cwd: 'src',
			dest: 'dist/'
		},
		{
			expand: true,
			src: ['CNAME'],
			cwd: '.',
			dest: 'dist/'
		}
	].map(function (opts) {
			return gtx.configFor('copy', opts);
		}));


	gtx.config({
		build_data: {
			deploy: {
				options: {
					config: './conf/tsd-json'
				}
			}
		},
		copy: {
			data: {    expand: true,
				src: '*.*',
				cwd: 'data',
				dest: 'dist/data/'
			}
		},
		'gh-pages': {
			options: {
				base: 'dist'
			},
			tsd: {
				options: {
					repo: 'https://github.com/DefinitelyTyped/tsd.git'
				},
				src: ['**/*']
			}
		}
	});

	gtx.alias('prep', [
		'clean',
		'jshint'
	]);
	gtx.alias('build', [
		'prep',
		'assemble:copy',
		'browserify:vue',
		'browserify:index',
		'less:build'
	]);
	gtx.alias('update', ['build', 'build_data:deploy', 'copy:data', 'gh-pages']);

	gtx.alias('test', ['build']);
	gtx.alias('default', ['test']);

	gtx.alias('run', ['build_data:deploy']);
	gtx.alias('dev', ['browserify:index']);

	gtx.finalise();
};
