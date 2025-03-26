import { Router } from 'express';
import {
    listAll,
    findById,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    enableDisableSurvey
} from '../controllers/surveys';
import { authMiddleware } from './../middlewares/auth';
import { rolesMiddleware } from './../middlewares/role';
import { UserRoles } from './../types/user';
import { createSurveyValidations, updateSurveyValidations } from './../middlewares/validations';

const router = Router();

const requiredRoles = [UserRoles.ADMIN];

router.get('', authMiddleware, rolesMiddleware(requiredRoles), listAll);
router.get('/:id', authMiddleware, rolesMiddleware(requiredRoles), findById);
router.post('', authMiddleware, rolesMiddleware(requiredRoles), createSurveyValidations(), createSurvey);
router.put('/:id', authMiddleware, rolesMiddleware(requiredRoles), updateSurveyValidations(), updateSurvey);
router.delete('/:id', authMiddleware, rolesMiddleware(requiredRoles), deleteSurvey);
router.post('/:id/publish', authMiddleware, rolesMiddleware(requiredRoles), enableDisableSurvey);

export default router;

// TODO: create a /booking endpoint for public (non-user) reservations from the website