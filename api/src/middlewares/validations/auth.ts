import { body } from 'express-validator';


export function signupValidations() {
    return [
        body('name').trim().notEmpty().isLength({ min: 3 }),
        body('email').trim().notEmpty().isEmail(),
        body('password').notEmpty().isLength({ min: 8 }),
    ]
}

export function loginValidations() {
    return [
        body('email').isEmail(),
        body('password').trim().notEmpty()
    ]
}

