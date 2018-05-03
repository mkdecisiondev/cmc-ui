const component = require('reshape-component');
const evalCode = require('reshape-eval-code');
const expressions = require('reshape-expressions');
const include = require('reshape-include');
const layouts = require('reshape-layouts');

module.exports = function (options = {}) {
	if (!options.locals) {
		options.locals = {};
	}

	const plugins = [
		layouts({
			root: options.root,
		}),
		include({
			root: options.root,
		}),
		component({
			componentPath: options.componentPath,
			preserveType: 'data-component-type',
			root: options.root,
		}),
		expressions(),
		evalCode(options.locals),
	];

	if (options.minify) {
		const minifyOptions = typeof options.minify === 'object' ? options.minify : {};

		plugins.push(require('reshape-minify')(minifyOptions));
	}
	else {
		plugins.push(require('reshape-beautify')({
			indent: options.indent,
		}));
	}

	return {
		locals: options.locals,
		plugins,
	};
};
