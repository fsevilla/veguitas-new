import { Router } from 'express';
import {
    listAll,
    findById,
    createReservation,
    updateReservation,
    deleteReservation
} from '../controllers/reservations';
import { authMiddleware } from './../middlewares/auth';
import { rolesMiddleware } from './../middlewares/role';
import { UserRoles } from './../types/user';
import { createReservationValidations, updateReservationValidations } from './../middlewares/validations';

const router = Router();

const requiredRoles = [UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.SOCIAL];

router.get('', authMiddleware, rolesMiddleware(requiredRoles), listAll);
router.get('/:id', authMiddleware, rolesMiddleware(requiredRoles), findById);
router.post('', authMiddleware, rolesMiddleware(requiredRoles), createReservationValidations(), createReservation);
router.put('/:id', authMiddleware, rolesMiddleware(requiredRoles), updateReservationValidations(), updateReservation);
router.delete('/:id', authMiddleware, rolesMiddleware(requiredRoles), deleteReservation);

export default router;

// TODO: create a /booking endpoint for public (non-user) reservations from the website