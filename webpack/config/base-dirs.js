const { resolve } = require('path');

module.exports = {
	entry: resolve(__dirname, '../../'),
	dist: resolve(__dirname, '../../dist/'),
	manifest: resolve(__dirname, '../../server/manifests/'),
};
