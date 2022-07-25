const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mqt:08520852@cluster0.vd7nr.mongodb.net/phimbox');
        console.log('Connect Success');
    }
    catch(error){
        console.log('Connect Fail');
    }
}

module.exports = { connect };