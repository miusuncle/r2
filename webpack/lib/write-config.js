const _ = require('lodash');
const fs = require('fs');
const { resolve } = require('path');

module.exports = config => {
	let contents = JSON.stringify(config, (key, val) => {
		if (_.isRegExp(val)) {
			return val.source.replace(/\\/g, '');
		}

		return val;
	}, '\t');

	contents = contents.replace(/\\\\/g, '/');

	const dest = resolve(__dirname, '../webpack.output.json');
	fs.writeFileSync(dest, contents);
};