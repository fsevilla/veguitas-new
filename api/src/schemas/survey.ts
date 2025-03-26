import { model, Schema } from 'mongoose';

const OptionSchema = new Schema({
    label: { type: String, required: true },
    value: { type: String, required: true },
});

const FieldSchema = new Schema({
    label: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ["text", "textarea", "boolean", "radio", "checkbox"],
        required: true,
    },
    options: { type: [OptionSchema], default: [] },
    required: { type: Boolean, default: false },
});

const SurveySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    fields: [FieldSchema],
    enabled: { type: Boolean }, // Whether it's visible for users to answer to
}, {
    timestamps: true
});

const schemaModel = model("surveys", SurveySchema);

export default schemaModel;