import { Router, json } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import reservationRoutes from './reservations';
import bookingRoutes from './booking';

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

export default router;