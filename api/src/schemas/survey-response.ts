import { model, Schema, Types } from 'mongoose';

const SurveyFieldResponseSchema = new Schema({
    surveyFieldId: { type: Types.ObjectId, required: true, ref: "surveys.fields" },
    value: { type: Schema.Types.Mixed, required: true }
});

const SurveyResponseSchema = new Schema({
    surveyId: { type: Types.ObjectId, required: true, ref: "surveys" },
    responses: [SurveyFieldResponseSchema],
}, {
    timestamps: true
});

const schemaModel = model("surveyResponses", SurveyResponseSchema);

export default schemaModel;