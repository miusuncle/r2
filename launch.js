require('babel-register')({
	plugins: [
		'transform-es2015-modules-commonjs',
	],
});

require('babel-polyfill');
require('app-module-path').addPath(__dirname);
require('server/app');