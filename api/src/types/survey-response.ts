import { ObjectId } from "mongoose";

export interface ISurveyFieldResponse {
    fieldId: ObjectId;
    value: string | number | boolean | string[];
}

export interface ISurveyResponse {
    surveyId: ObjectId;
    responses: ISurveyFieldResponse[];
    createdAt?: number;
    updatedAt?: number;
}
