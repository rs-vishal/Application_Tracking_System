const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    
    status: {
        type: String,
        enum: ["scheduled", "completed", "cancelled"],
        default: "scheduled"
    },
    scheduledAt: {
        type: Date,
        default: Date.now
    }
});

const Model = mongoose.model("Interview", interviewSchema);
module.exports = Model;