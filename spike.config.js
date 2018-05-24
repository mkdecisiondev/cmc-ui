const path = require('path');
const webpack = require('webpack');
const babelConfig = require('./config/build/babel');
const postcssConfig = require('./config/build/postcss');
const reshapeConfig = require('./config/build/reshape');
const config = require('./config/main');
const env = process.env.SPIKE_ENV;

const endpoints = {
	master: '',
	production: 'https://gnn3szkqtb.execute-api.us-west-2.amazonaws.com/Prod',
};

const serviceUrl = endpoints[process.env.RELEASE] || endpoints.master;

const webpackConfig = {
	devtool: 'source-map',
	entry: {
		'js/main': './assets/js/main.js',
		'js/contact': './src/contact.js',
		'js/photos': './src/photos.js',
		'js/registration': './src/registration.js',
	},
	plugins: [
		new webpack.DefinePlugin({
			WD_SERVICE_URL: `"${serviceUrl}"`,
		}),
	],
	resolve: {
		alias: {
			'./htmlResources.js': './htmlResources-shim.js',
		},
	},
};

const spikeConfig = {
	babel: babelConfig(),
	cleanUrls: true,
	dumpDirs: [
		'assets',
		'src',
	],
	ignore: [
		'.gitignore',
		'.htmlhintrc',
		'dist/**',
		'**/layout*.html',
		'**/_*',
		'**/.*',
		'src/components/**/*.css',
		'src/components/**/*.html',
		'src/templates/**',
		'LICENSE',
		'readme.md',
		'README.md',
		'package-lock.json',
		'shrinkwrap.yaml',
		'yarn.lock',
		'Jenkinsfile',
		'readme.md',
		'shrinkwrap.yaml',
	],
	postcss: postcssConfig({
		minify: env === 'production',
		warnForDuplicates: env !== 'production',
	}),
	reshape: reshapeConfig({
		indent: 4,
		locals: config,
		minify: env === 'production',
		root: path.resolve('./src'),
	}),
	vendor: [
		'src/js/*.js',
	],
};

module.exports = Object.assign({}, webpackConfig, spikeConfig);
