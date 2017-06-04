const webpack = require('webpack');
const _ = require('lodash');
const deepmerge = require('deepmerge');
const { join, dirname, basename } = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const { RELEASE } = require('./lib/constants');
const writeConfig = require('./lib/write-config');
const { publicPath, baseDirs, bundleRules, externals, devServer } = require('./config');

module.exports = env => {
	const { target, uglifyjs } = env;
	const webpackConfigs = [];

	if (_.isEmpty(bundleRules)) {
		console.error('\n========================================');
		console.error('Build List <empty>');
		console.error('========================================\n');
		process.exit(-1);
	};

	_.each(bundleRules, rule => {
		const dest = join(target, rule.entry).replace(/\.jsx?$/, '');

		let webpackConfig = {
			name: `[${rule.desc || ''}]`,
			context: baseDirs.entry,

			entry: {
				[dest]: [rule.entry],
			},

			output: {
				publicPath,
				path: baseDirs.dist,
				jsonpFunction: '__ASYNC_REQUIRE__',
				filename: `[name]${target === RELEASE ? '.[chunkhash:10]' : ''}.js`,
				chunkFilename: `${dest}![name]${target === RELEASE ? '.[chunkhash:10]' : ''}.js`,
			},

			resolve: {
				modules: [baseDirs.entry, 'node_modules'],
				extensions: ['.js', '.jsx'],
			},

			module: {
				rules: [
					{
						test: /\.jsx?$/,
						use: ['babel-loader'],
						exclude: /node_modules/,
					},
				],
			},

			externals,

			plugins: (() => {
				const plugins = [];

				if (target === RELEASE) {
					plugins.push(
						new webpack.DefinePlugin({
							'process.env':{
								'NODE_ENV': JSON.stringify('production'),
							},
						})
					);
				}

				if (rule.manifest) {
					plugins.push(
						new AssetsPlugin({
							path: join(baseDirs.manifest, dirname(rule.manifest)),
							filename: basename(rule.manifest),
							fullPath: true,
							includeManifest: false,
							update: true,
							processOutput: assets => {
								let js = _.get(assets, `${dest}.js`);

								if (target === RELEASE) {
									js += '?max_age=31536000';
								}

								return JSON.stringify({ js }, null, '\t');
							},
						})
					);
				}

				if (uglifyjs) {
					plugins.push(
						new webpack.optimize.UglifyJsPlugin({
							compress: {
								warnings: false,
							},
							output: {
								beautify: false,
								ascii_only: true,
								comments: false,
							},
						})
					);
				}

				return plugins;
			})(),
		};

		if (env.dev) {
			webpackConfig.devtool = 'inline-source-map';

			webpackConfig.plugins.push(
				new webpack.HotModuleReplacementPlugin()
			);

			webpackConfig.output.publicPath = devServer.publicPath;
			webpackConfig.devServer = devServer;
		}

		// merge custom config
		webpackConfig = deepmerge(webpackConfig, (() => {
			const { $config } = rule;
			let ret;

			if (typeof $config === 'function') {
				ret = $config(webpackConfig, env);
			} else {
				ret = $config;
			}

			return _.isObject(ret) ? ret : {};
		})());

		webpackConfigs.push(webpackConfig);
	});

	// write config to file for reference
	writeConfig(webpackConfigs);

	return webpackConfigs;
};
