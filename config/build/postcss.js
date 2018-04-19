const autoprefixer = require('autoprefixer');
const calc = require('postcss-calc');
const customMedia = require('postcss-custom-media');
const customProperties = require('postcss-custom-properties');
const nesting = require('postcss-nesting');
const postcssImport = require('postcss-import');

module.exports = function (options = {}) {
	const plugins = [
		postcssImport(),
		customProperties(),
		calc(),
		nesting(),
		customMedia(),
		autoprefixer(),
	];

	if (options.minify) {
		plugins.push(require('cssnano')());
	}

	return {
		plugins,
	};
};
