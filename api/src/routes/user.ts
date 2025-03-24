import { Router } from 'express';
import {
    listAll,
    findById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/users';
import { authMiddleware } from './../middlewares/auth';
import { rolesMiddleware } from './../middlewares/role';
import { UserRoles } from './../types/user';
import { createUserValidations, updateUserValidations } from './../middlewares/validations';

const router = Router();

// router.get('', UsersController.signup);
router.get('', authMiddleware, rolesMiddleware([UserRoles.ADMIN]), listAll);
router.get('/:id', authMiddleware, rolesMiddleware([UserRoles.ADMIN]), findById);
router.post('', authMiddleware, rolesMiddleware([UserRoles.ADMIN]), createUserValidations(), createUser);
router.put('/:id', authMiddleware, rolesMiddleware([UserRoles.ADMIN]), updateUserValidations(), updateUser);
router.delete('/:id', authMiddleware, rolesMiddleware([UserRoles.ADMIN]), deleteUser);

export default router;