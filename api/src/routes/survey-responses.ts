import { Router } from 'express';
import {
    listAllBySurveyId,
    findById,
    createSurveyResponse,
    deleteSurveyResponse
} from '../controllers/survey-responses';
import { authMiddleware } from './../middlewares/auth';
import { rolesMiddleware } from './../middlewares/role';
import { UserRoles } from './../types/user';
import { createSurveyResponseValidations } from './../middlewares/validations';

const router = Router();

const requiredRoles = [UserRoles.ADMIN];

router.get('', authMiddleware, rolesMiddleware(requiredRoles), listAllBySurveyId);
router.get('/:id', rolesMiddleware(requiredRoles), findById);
router.delete('/:id', rolesMiddleware(requiredRoles), deleteSurveyResponse);
router.post('', createSurveyResponseValidations(), createSurveyResponse); // Can be answered by a client (public)

export default router;

// TODO: track user, store name/email/phone, track with reservations