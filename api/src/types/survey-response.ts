import { ObjectId } from "mongoose";

export interface ISurveyFieldResponse {
    surveyFieldId: ObjectId;
    value: string | number | boolean | string[];
}

export interface ISurveyResponse {
    surveyId: ObjectId;
    responses: ISurveyFieldResponse[];
    createdAt?: number;
    updatedAt?: number;
}
