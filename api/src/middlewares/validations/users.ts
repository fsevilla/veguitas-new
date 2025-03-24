import { body } from 'express-validator';


export function createUserValidations() {
    return [
        body('name').trim().notEmpty().isLength({ min: 3 }),
        body('email').trim().notEmpty().isEmail(),
        body('password').notEmpty().isLength({ min: 8 }),
        body('role').notEmpty(),
    ]
}


export function updateUserValidations() {
    return [
        body('name').optional().trim().isLength({ min: 3 }),
        body('email').optional().trim().isEmail(),
        body('role').optional(),
        body('status').optional(),
    ]
}

