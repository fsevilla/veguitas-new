import { Router, json } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import reservationRoutes from './reservations';
import bookingRoutes from './booking';
import surveysRoutes from './surveys';
import surveyResponsesRoutes from './survey-responses';

const router = Router();

router.get('', (req, res) => {
    res.send('Veguitas api works!');
});

router.get('/version', (req, res) => {
    res.send(process.env.npm_package_version);
})

router.use(json());
router.use(authRoutes);
router.use('/users', userRoutes);
router.use('/reservations', reservationRoutes);
router.use('/booking', bookingRoutes);
router.use('/surveys', surveysRoutes);
router.use('/survey-answers', surveyResponsesRoutes);

export default router;