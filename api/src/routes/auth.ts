import { Router } from 'express';
import { signup, login, confirmUser, getLoggedInUser } from  './../controllers/auth';
import { loginValidations, signupValidations } from './../middlewares/validations';
import { googleSignup, getGoogleToken } from '../controllers/google';
import { authMiddleware } from './../middlewares/auth';

const router = Router();

router.post('/signup', signupValidations(), signup);
router.post('/auth', loginValidations(), login);
router.get('/account/confirm', confirmUser);
router.get('/auth/me', authMiddleware, getLoggedInUser);

router.get('/auth/google', googleSignup);
router.get('/google/confirm', getGoogleToken);

export default router;