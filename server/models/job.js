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
    location:{
        type:String,
        required:true
    },
    type:{
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
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
});

const Model = mongoose.model("Job", job);
module.exports = Model;
