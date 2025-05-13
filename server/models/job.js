const mongoose = require("mongoose");
const job = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["open","closed"],
        default:"open"
    },
    salary:{
        type:Number,
        required:true
    },
});

const Model = mongoose.model("Job", job);
module.exports = Model;
