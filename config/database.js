const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        console.log('Connecting database...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connect success');
    } catch (error) {
        console.log("Can't connect");
        console.error(error);
    }
}