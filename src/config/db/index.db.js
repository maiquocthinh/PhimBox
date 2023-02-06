const mongoose = require('mongoose');

async function connect() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('Connect Success');
	} catch (error) {
		console.log('Connect Fail');
	}
}

module.exports = { connect };
