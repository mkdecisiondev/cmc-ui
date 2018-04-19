const CompressionPlugin = require('compression-webpack-plugin');
const optimize = require('spike-optimize');
const webpack = require('webpack');

module.exports = {
	devtool: false,
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"',
		}),
	],
	afterSpikePlugins: [
		...optimize({
			scopeHoisting: true,
			// splitting is useful if files are being served with HTTP2
			aggressiveSplitting: false,
			minify: true,
		}),
		new CompressionPlugin({
			test: [ /\.html/ ],
			asset: '[path]',
			filename: (asset) => {
				return asset.split('.')[0];
			},
			deleteOriginalAssets: true,
		}),
		new CompressionPlugin({
			test: [ /\.js/, /\.css/ ],
			asset: '[path]',
		}),
	],
	ignore: [
		'.gitignore',
		'.htmlhintrc',
		'public/**',
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
	],
	outputDir: 'dist',
};
