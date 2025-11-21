import { Router } from 'express';

import { create, deleteById, getAll, getById, update } from 'controllers/events';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validatorCreate, validatorEdit } from 'middleware/validation/events';

import { UserRole } from '../../orm/entities/users/types';

const router = Router();

router.get('/', getAll);

router.get('/:id', getById);

router.post('/', [checkJwt, checkRole([UserRole.SPEAKER]), validatorCreate], create);

router.patch('/:id', [checkJwt, checkRole([UserRole.SPEAKER]), validatorEdit], update);

router.delete('/:id', [checkJwt, checkRole([UserRole.SPEAKER])], deleteById);

export default router;
