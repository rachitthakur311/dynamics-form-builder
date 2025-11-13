const mongoose = require("mongoose");

const Usersubmissionschema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Form",
        required: true
    },
    answers: {
        type: Object,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    meta: {
        ip: String,
        userAgent: String
    }
}, { timestamps: true });


module.exports = mongoose.model("Submission", Usersubmissionschema)