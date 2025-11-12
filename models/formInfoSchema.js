const mongoose = require("mongoose");

const formInformationSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "form",
        required: true
    },
    label: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["text", "textarea", "number", "email", "date", "checkBox", "radio", "select"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    required: {
        type: Boolean,
        default: false
    },
    options: [
        {
            value: { type: String, required: true },
            label: { type: String, required: true }, // value shown in UI
            order: { type: Number, default: 0 },
        }
    ],
    validation: {
        min: Number,
        max: Number,
        regex: String
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    visibility: {
        parentFieldId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field"
        },
        showWhenOptionValue: {
            type: String
        },

    }
}, { timestamps: true });

formInformationSchema.index({ formId: 1, name: 1 }, { unique: true });

const Field = mongoose.model('Field', formInformationSchema);

module.exports = Field;

