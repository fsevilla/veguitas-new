import { Router } from 'express';

import { createBooking } from './../controllers/reservations';
import { createBookingValidations } from './../middlewares/validations';
import { validClientMiddleware } from './../middlewares/client';

const router = Router();

router.post('', validClientMiddleware, createBookingValidations(), createBooking);

export default router;
