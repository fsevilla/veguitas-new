import { ObjectId } from 'bson';
import { Request, Response } from "express";
import { MongooseQueryOptions } from "mongoose";

import { validationResult, matchedData } from 'express-validator';

import { HttpStatus } from "./../types/http-status";
import Survey from "./../models/survey";
import { ISurvey } from './../types/survey';

export async function listAll(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {};

        if (req.query.includeDisabled !== 'true') {
            options.enabled = true;
        }

        const surveys = await Survey.findAll(options);
        const cleanedSurveys = Survey.cleanRecords(surveys);
        res.send(cleanedSurveys);
    } catch (e) {
        res.status(HttpStatus.SERVER_ERROR).send({ message: 'cannot retrieve surveys' })
    }
}

export async function findById(req: Request, res: Response) {
    try {
        const options: MongooseQueryOptions = {
            _id: req.params.id
        };

        const survey = await Survey.findOne(options);
        if (survey) {
            const cleanedSurvey = Survey.cleanRecord(survey);
            res.send(cleanedSurvey);
        } else {
            res.status(HttpStatus.NOT_FOUND).send({ message: 'survey not found' });
        }
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'invalid survey id' });
    }
}

export async function createSurvey(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {

        const surveyData = matchedData(req);

        // const now = new Date().getTime();
        Survey.create({
            title: surveyData.title,
            description: surveyData.description,
            fields: surveyData.fields,
            enabled: false, // Needs to be enabled 
        }).then(response => {
            const cleanedSurvey = Survey.cleanRecord(response);
            res.send(cleanedSurvey);
        }).catch(e => {
            if ((e.message as string).includes('duplicate key')) {
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Survey already exists' })
            } else {
                console.log('Failed to create survey: ', e);
                res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not create survey' })
            }
        })
    } else {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing data' })
    }
}

export async function updateSurvey(req: Request, res: Response) {
    try {
        const surveyId = new ObjectId(req.params.id);
        const result = validationResult(req);

        if (result.isEmpty()) {

            const surveyData = matchedData(req);

            Survey.findAndUpdate(surveyId, surveyData).then(response => {
                if (response) {
                    const cleanedSurvey = Survey.cleanRecord(response);
                    res.send(cleanedSurvey);
                } else {
                    res.status(HttpStatus.NOT_FOUND).send({ message: 'Survey not found' })
                }
            }).catch(e => {
                if ((e.message as string).includes('duplicate key')) {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Survey already exists' })
                } else {
                    res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not update survey' })
                }
            })
        } else {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid data' })
        }

    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid survey id' })
    }
    
}

export async function deleteSurvey(req: Request, res: Response) {
    try {
        const surveyId = new ObjectId(req.params.id);

        Survey.delete(surveyId).then(response => {
            if (response) {
                res.send();
            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'Survey not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not delete survey' })
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid survey id' })
    }

}

export async function enableDisableSurvey(req: Request, res: Response) {
    try {
        const surveyId = new ObjectId(req.params.id);
        const enabled = !!req.body.enabled;

        Survey.findAndUpdate(surveyId, { enabled }).then((response) => {
            if (response) {
                const cleanedSurvey = Survey.cleanRecord(response);
                res.send(cleanedSurvey);
            } else {
                res.status(HttpStatus.NOT_FOUND).send({ message: 'Survey not found' })
            }
        }).catch(e => {
            res.status(HttpStatus.BAD_REQUEST).send({ message: 'Could not confirm the survey' });
        })
    } catch (e) {
        res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid survey id' })
    }

}