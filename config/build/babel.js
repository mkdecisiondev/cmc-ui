const objectAssign = require('babel-plugin-transform-object-assign');
const env = require('babel-preset-env');

module.exports = function () {
	return {
		plugins: [ objectAssign ],
		presets: [ [ env, { modules: false } ] ],
	};
};
