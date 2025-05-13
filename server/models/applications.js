const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    
    status: {
        type: String,
        enum: ["applied", "interviewed", "hired", "rejected"],
        default: "applied"
    },
    appliedAt: {
        type: Date,
        default: Date.now  
    }
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
