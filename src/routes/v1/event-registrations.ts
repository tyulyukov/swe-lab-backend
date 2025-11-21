import { Router } from 'express';

import { getAll, getById, create, update, deleteById } from 'controllers/event-registrations';
import { checkJwt } from 'middleware/checkJwt';
import { validatorCreate } from 'middleware/validation/event-registrations';

const router = Router();

router.get('/', [checkJwt], getAll);

router.get('/:event_id', [checkJwt], getById);

router.post('/', [checkJwt, validatorCreate], create);

router.patch('/:event_id', [checkJwt], update);

router.delete('/:event_id', [checkJwt], deleteById);

export default router;
