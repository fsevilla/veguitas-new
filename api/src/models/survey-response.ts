import { MongooseQueryOptions, Types } from 'mongoose';
import SurveyResponseSchema from './../schemas/survey-response';
import { BaseModel } from './db';
import { ISurveyResponse } from './../types/survey-response';

export class SurveyResponse extends BaseModel {

    constructor() {
        super(SurveyResponseSchema);
    }

    create(data: ISurveyResponse) {
        return SurveyResponseSchema.create({
            ...data,
        })
    }

    findAll(options: MongooseQueryOptions = {}) {
        return SurveyResponseSchema.find({
            ...options
        })
    }


    findOne(options: MongooseQueryOptions) {
        return SurveyResponseSchema.findOne({
            ...options,
        })
    }

    delete(surveyId: Types.ObjectId) {
        return SurveyResponseSchema.deleteOne({
            _id: surveyId
        })
    }

}

const surveyResponse = new SurveyResponse();

export default surveyResponse;