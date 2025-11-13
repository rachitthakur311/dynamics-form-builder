const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 120
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    isArchive: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });


module.exports = mongoose.model("form", formSchema)