import { MongooseQueryOptions, Types } from 'mongoose';
import SurveySchema from './../schemas/survey';
import { BaseModel } from './db';
import { ISurvey } from './../types/survey';

export class Survey extends BaseModel {

    constructor() {
        super(SurveySchema);
    }

    create(data: ISurvey) {
        return SurveySchema.create({
            ...data,
        })
    }

    findAll(options: MongooseQueryOptions = {}) {
        return SurveySchema.find({
            ...options
        })
    }


    findOne(options: MongooseQueryOptions) {
        return SurveySchema.findOne({
            ...options,
        })
    }

    findAndEnable(surveyId: Types.ObjectId) {
        return SurveySchema.findOneAndUpdate({
            _id: surveyId,
        }, {
            enabled: true
        })
    }

    findAndDisable(surveyId: Types.ObjectId) {
        return SurveySchema.findOneAndUpdate({
            _id: surveyId,
        }, {
            enabled: false
        })
    }

    delete(surveyId: Types.ObjectId) {
        return SurveySchema.deleteOne({
            _id: surveyId
        })
    }

    findAndUpdate(surveyId: Types.ObjectId, data: MongooseQueryOptions) {
        return SurveySchema.findOneAndUpdate({
            _id: surveyId,
        }, data, { new: true });
    }
}

const survey = new Survey();

export default survey;