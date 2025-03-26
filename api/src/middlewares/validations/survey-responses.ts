import { body } from 'express-validator';

export function createSurveyResponseValidations() {
    return [
        body('survey').trim().notEmpty(),
        body('responses').optional().isArray(),
    ]
}




