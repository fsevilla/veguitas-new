import { body } from 'express-validator';

export function createReservationValidations() {
    return [
        body('name').trim().notEmpty().isLength({ min: 3 }),
        body('email').optional().trim().isEmail(),
        body('phone').optional().trim(),
        body('people').notEmpty().isNumeric(),
        body('unique').optional().isBoolean(),
        body('reservationDate').notEmpty(),
        body('reservationTime').notEmpty(),
        body('origin').notEmpty(),
    ]
}

export function updateReservationValidations() {
    return [
        body('name').optional().trim().isLength({ min: 3 }),
        body('email').optional().trim().isEmail(),
        body('phone').optional().trim(),
        body('origin').optional().trim(),
        body('status').optional(),
    ]
}

export function createBookingValidations() {
    return [
        body('name').trim().notEmpty().isLength({ min: 3 }),
        body('email').optional().trim().isEmail(),
        body('phone').optional().trim(),
        body('people').notEmpty().isNumeric(),
        body('unique').optional().isBoolean(),
        body('reservationDate').notEmpty(),
        body('reservationTime').notEmpty(),
        // body('origin').notEmpty(), // Created by website or mobile app (TBD)
    ]
}

