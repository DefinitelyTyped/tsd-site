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
			public: ['public/**/*'],
			dump: ['test/**/dump']
		},
		less: {
			build: {
				options: {},
				files: {
					'public/css/build.css': [
						'assets/css/build.less'
					]
				}
			}
		}
	});

	gtx.alias('assemble:copy', [
		{	src: 'bower_components/bootstrap/dist/js//bootstrap.min.js',
			dest: 'public/js/bootstrap.js'
		},
		{	expand: true,
			src: '*.*',
			cwd: 'bower_components/bootstrap/dist/fonts',
			dest: 'public/fonts/'
		},
		{	expand: true,
			src: '*.*',
			cwd: 'data',
			dest: 'public/data/'
		},
		{	expand: true,
			src: ['*.html', 'js/**/*.js'],
			cwd: 'assets',
			dest: 'public/'
		},
		{	expand: true,
			src: ['CNAME'],
			cwd: '.',
			dest: 'public/'
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
		}
	});

	gtx.alias('prep', [
		'clean',
		'jshint'
	]);
	gtx.alias('build', [
		'prep',
		'assemble:copy',
		'less:build'
	]);
	gtx.alias('update', ['build_data:deploy']);

	gtx.alias('test', ['build']);
	gtx.alias('default', ['test']);

	gtx.alias('dev', ['update']);

	gtx.finalise();
};
