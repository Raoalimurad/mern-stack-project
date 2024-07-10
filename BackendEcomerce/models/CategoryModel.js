const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name:{
        require:true,
        type:String,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true
    }
})

module.exports = mongoose.model("categories",categorySchema)