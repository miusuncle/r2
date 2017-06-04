import express from 'express';

const app = express();

const manifests = {
	base: require('server/manifests/base'),
};

app.get('/', (req, res) => {
	res.send(manifests.base);
});

const port = 9996;
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});

import 'shared/scenes/sample';