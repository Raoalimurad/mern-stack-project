const mongoose =  require("mongoose")
const colors = require("colors")
const connectDb = async ()=>{
    try {
        const connect  =await mongoose.connect(process.env.MONGO_URL)
        console.log("connected database",connect.connection.host)
    } catch (error) {
        console.log(`error is ${error}`.red)
    }
}
module.exports = connectDb;
