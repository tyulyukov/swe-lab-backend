import { Request, Response, NextFunction } from 'express';
import isBoolean from 'validator/lib/isBoolean';
import isEmpty from 'validator/lib/isEmpty';
import isISO8601 from 'validator/lib/isISO8601';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, is_online, event_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (isEmpty(name || '')) {
    errorsValidation.push({ name: 'Name is required' });
  }

  if (is_online === undefined || is_online === null || !isBoolean(String(is_online))) {
    errorsValidation.push({ is_online: 'is_online must be a boolean value' });
  }

  if (isEmpty(event_date || '')) {
    errorsValidation.push({ event_date: 'Event date is required' });
  } else if (!isISO8601(event_date)) {
    errorsValidation.push({ event_date: 'Invalid event date format. Use ISO8601 format.' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create event validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
