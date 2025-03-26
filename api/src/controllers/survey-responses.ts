import { ObjectId } from 'bson';
import { Request, Response } from "express";
import { MongooseQueryOptions } from "mongoose";

import { validationResult, matchedData } from 'express-validator';

import { HttpStatus } from "./../types/http-status";
import SurveyResponse from "./../models/survey-response";
import Survey from "./../models/survey";

export async function listAllBySurveyId(req: Request, res: Response) {
    try {
        if (!req.query.survey) {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing Survey ID '});
            return;
        }
        const surveyId = new ObjectId(req.query.survey as string);
        const responses = await SurveyResponse.findAll({ surveyId });
        const cleanedSurveyResponses = SurveyResponse.cleanRecords(responses);
        res.send(cleanedSurveyResponses);
    } catch (e) {
        res.status(HttpStatus.SERVER_ERROR).send({ message: 'cannot retrieve survey responses' })
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {
            _id: req.params.id
        };

        const surveyResponse = await SurveyResponse.findOne(options);
        if (surveyResponse) {
            const cleanedSurveyResponse = SurveyResponse.cleanRecord(surveyResponse);
            res.send(cleanedSurveyResponse);
        } else {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'survey response not found' });
        }
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'invalid survey response id' });
    }
}

export async function createSurveyResponse(req: Request, res: Response) {
    const result = validationResult(req);

    const surveyId = new ObjectId(req.body.survey as string);
    const activeSurvey = await Survey.findIfActive(surveyId);

    console.log('Active survey: ', activeSurvey);

    if (!activeSurvey) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Survey not found' });
        return;
    }

    console.log('Active survey? ', activeSurvey, result);


    if (result.isEmpty()) {

        const surveyData = matchedData(req);

        SurveyResponse.create({
            surveyId: surveyData.survey,
            responses: surveyData.responses
        }).then(response => {
            const cleanedSurveyResponse = SurveyResponse.cleanRecord(response);
            res.send(cleanedSurveyResponse);
        }).catch(e => {
            if ((e.message as string).includes('duplicate key')) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'SurveyResponse already exists' })
            } else {
                console.log('Failed to create survey response: ', e);
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not create survey response' })
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing data' })
    }
}

export async function deleteSurveyResponse(req: Request, res: Response) {
    try {
        const surveyResponseId = new ObjectId(req.params.id);

        SurveyResponse.delete(surveyResponseId).then(response => {
            if (response) {
                res.send();
            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'SurveyResponse not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not delete survey response' })
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid survey response id' })
    }

}
