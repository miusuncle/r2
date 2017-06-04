module.exports = {
	host: 'localhost',
	port: 3000,

	publicPath: 'http://localhost:3000/qcloud/xxx/scripts/',

	// respond to 404s with index.html
	historyApiFallback: true,

	// enable HMR on the server
	hot: true,

	proxy: {
		'/': 'http://localhost:9996',
	},
};