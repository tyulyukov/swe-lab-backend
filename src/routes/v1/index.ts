import { Router } from 'express';

import auth from './auth';
import eventRegistrations from './event-registrations';
import events from './events';

const router = Router();

router.use('/auth', auth);
router.use('/events', events);
router.use('/event-registrations', eventRegistrations);

export default router;
