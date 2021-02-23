const mongoose = require('mongoose');
const MongoURI = "mongodb+srv://akshay:admin@cluster0.3sl2w.mongodb.net/atlasdb?retryWrites=true&w=majority"

const InitMongo = async ()=> {
    try {
    await mongoose.connect(MongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log("Connected to MY_DB_1...")
} catch(e) {
    console.log(e);
    throw e
}
}
module.exports = InitMongo;