import { body } from 'express-validator';

export function createSurveyValidations() {
    return [
        body('title').trim().notEmpty().isLength({ min: 3 }),
        body('description').trim().notEmpty().isLength({ min: 3 }),
        body('fields').optional().isArray(),
        body('enabled').optional().isBoolean(),
    ]
}

export function updateSurveyValidations() {
    return [
        body('title').optional().trim().isLength({ min: 3 }),
        body('description').optional().trim().isLength({ min: 3 }),
        body('fields').optional().isArray(),
        body('enabled').optional().isBoolean(),
    ]
}


