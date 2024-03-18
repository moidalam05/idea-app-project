import config from './src/config/index.js';
import mongoose from 'mongoose';
import app from './src/app.js';

(async () => {
	try {
		await mongoose.connect(config.MONGODB_URL);
		console.log('MongoDB connected...');

		app.on('error', (err) => {
			console.log(err);
			throw err;
		});

		const onListening = () => {
			console.log(`Listening on port ${config.PORT}`);
		};

		app.listen(config.PORT, onListening);
	} catch (error) {
		console.log('ERROR: ', error);
		throw error;
	}
})();
