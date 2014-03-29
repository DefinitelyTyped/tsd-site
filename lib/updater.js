module.exports = function (writeln) {
	if (!writeln) {
		writeln = function (str) {
			console.log(str);
		};
	}

	var path = require('path');
	var tsd = require('tsd');

	function getAPI(options) {
		writeln('-> config: ' + options.config);
		var api = tsd.getAPI(options.config, options.verbose);
		if (options.cacheDir) {
			writeln('cacheDir: ' + options.cacheDir);
			api.context.paths.cacheDir = path.resolve(options.cacheDir);
		}
		return api;
	}

	function getIndex(options) {
		var api = getAPI(options);

		return api.readConfig(options.config, (!!options.config)).then(function () {
			var opts = new tsd.Options();

			var query = new tsd.Query();
			//query.parseInfo = true;
			query.addNamePattern('*');
			query.parseInfo = true;

			return api.select(query, opts).progress(function (note) {
				writeln('-> note: ' + note.message);
			});
		}).then(function (selection) {
			return selection.definitions.sort(tsd.DefUtil.defCompare).map(function (def) {
				var ret = {
					project: def.project,
					name: def.name,
					path: def.path
				};
				if (def.semver) {
					ret.semver = def.semver;
				}
				if (def.head.info) {
					ret.info = def.head.info;
				}
				return ret;
			});
		}).then(function (content) {
			var ret = {
				repo: api.context.config.repo,
				ref: api.context.config.ref
			};
			ret.urls = {
				def: 'https://github.com/' + ret.repo + '/blob/' + ret.ref + '/{path}'
			};
			ret.updatedAt = Date.now();
			ret.count = content.length;
			ret.content = content;
			return ret;
		});
	}

	var scope = {
		getIndex: getIndex
	};
	return scope;
};
