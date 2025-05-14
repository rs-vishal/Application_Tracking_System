const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {   
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user","recruiter"],
        default: "user",
    },
    skills: {
        type: [String],
        default: [],
    },
    resume: {
        type: String,
        default: null,
    },  
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Model = mongoose.model("User", user);

module.exports = Model;
