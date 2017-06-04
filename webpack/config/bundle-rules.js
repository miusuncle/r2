module.exports = [
	{
		desc: 'React & ReactDOM',
		entry: 'shared/vendor/base.js',
		manifest: 'base.json',
		$config(webpackConfig, env) {
			webpackConfig.externals = {};
		},
	},

	{
		desc: 'Sample',
		entry: 'shared/scenes/sample.js',
		manifest: 'scenes/sample.json',
	},
];
