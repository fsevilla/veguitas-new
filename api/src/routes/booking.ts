import { Router } from 'express';
import {
    createBooking,
    confirmBooking,
    listAll
} from '../controllers/bookings';
import { createBookingValidations } from './../middlewares/validations';
import { validClientMiddleware } from './../middlewares/client';
import { UserRoles } from './../types/user';
import { authMiddleware } from './../middlewares/auth';
import { rolesMiddleware } from './../middlewares/role';

const router = Router();

const requiredRoles = [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.SOCIAL];

router.post('', validClientMiddleware, createBookingValidations(), createBooking);

router.get('', authMiddleware, rolesMiddleware(requiredRoles), listAll);
router.post('/:id/confirm', authMiddleware, rolesMiddleware(requiredRoles), confirmBooking);

export default router;

// TODO: create a /booking endpoint for public (non-user) reservations from the website