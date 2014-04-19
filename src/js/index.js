var Vue = require('vue');
var lib = require('./lib');

//grab global (hacky skip browserifing node version)
if (!window.oboe) {
	throw new Error('expected oboe global object');
}

function escapeRegExp(str) {
	return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

var table = new Vue({
	el: '#def-table',
	data: {
		active: false,
		repo: null,
		ref: null,
		updated: null,
		sortKey: 'project',
		sortReverse: false,
		searchTerm: null,
		urls: {},
		pageNum: 0,
		pageLim: 0,
		pagePer: 15,
		pageButtons: 9,
		total: 0,
		count: 0,
		pageNumbers: [],
		selection: [],
		visible: [],
		all: []
	},
	computed: {
	},
	methods: {
		activate: function () {
			this.active = true;
			this.updatePages();
		},
		update: function () {
			// TODO debounce?
			var value = this.all;
			if (typeof this.searchTerm === 'string' && this.searchTerm !== '') {
				var exp = new RegExp('.*' + escapeRegExp(this.searchTerm) + '.*', 'i');
				value = value.filter(function (def) {
					return exp.test(def.name) || exp.test(def.project);
				});
			}
			this.selection = value;
			this.updateSort();
		},
		updateSort: function () {
			var flip = this.sortReverse ? -1 : 1;
			var that = this;
			this.selection = this.selection.sort(function (defA, defB) {
				var a = defA[that.sortKey];
				var b = defB[that.sortKey];
				return (a < b ? -1 : a > b ? 1 : 0) * flip;
			});
			this.updatePages();
		},
		updatePages: function () {
			this.pageLim = Math.floor(this.selection.length / this.pagePer);
			this.pageNum = Math.min(Math.max(0, this.pageNum), this.pageLim);
			this.visible = this.selection.slice(this.pageNum * this.pagePer, (this.pageNum + 1) * this.pagePer);
			this.updatePageNumbers();
		},
		updatePageNumbers: function () {
			var half = Math.round(this.pageButtons / 2);
			var left = Math.max(this.pageNum - half, 0);
			var right = Math.min(left + this.pageButtons, this.pageLim);
			left = Math.max(0, Math.min(left, this.pageLim - this.pageButtons));
			var ret = [];
			for (var i = left; i <= right; i++) {
				ret.push(i);
			}
			this.pageNumbers = ret;
			return ret;
		},
		sortOn: function (key) {
			if (this.sortKey === key) {
				this.sortKey = key;
				this.sortReverse = !this.sortReverse;
			}
			else {
				this.sortKey = key;
				this.sortReverse = false;
			}
			this.updateSort();
		},
		showPage: function (num) {
			this.pageNum = Math.min(Math.max(0, num), this.pageLim);
			this.updatePages();
		},
		showFirstPage: function () {
			this.showPage(0);
		},
		showLastPage: function () {
			this.showPage(this.pageLim);
		},
		showNextPage: function () {
			this.showPage(this.pageNum + 1);
		},
		showPrevPage: function () {
			this.showPage(this.pageNum - 1);
		}
	}
});

// make method of model?
function getDefURL(path) {
	if (table.$data.urls.def) {
		return table.$data.urls.def.replace('{path}', path);
	}
	return null;
}

function loadData(data, url, done) {
	// console.log('loadData %s', url);

	oboe(url)
	.node('!repo', function (value) {
		data.repo = value;
	})
	.node('!ref', function (value) {
		data.ref = value;
	})
	.node('!urls', function (value) {
		data.urls = value;
		data.all.forEach(function (def) {
			def.url = getDefURL(def.path);
		});
	})
	.node('!updatedAt', function (value) {
		data.updatedAt = new Date(value);
	})
	.node('!count', function (value) {
		data.count = value;
	})
	.node('!content.[*]', function (def) {
		def.url = getDefURL(def.path);
		if (data.visible.length < 10) {
			data.visible.$set(data.visible.length, def);
		}
		data.all.push(def);
		data.selection.push(def);
		data.total = data.all.length;
	})
	.done(function () {
		table.activate();
		if (done) {
			done(null, data);
		}
	});
}

loadData(table.$data, lib.absoluteURI('data/repository.json'), function(err, data) {
	if (err) {
		throw err;
	}
});
