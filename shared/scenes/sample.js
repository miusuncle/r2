const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
	await delay(1000);
	console.log('done');
};

run();