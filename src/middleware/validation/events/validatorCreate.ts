import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { name, is_online, event_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (!name || name.trim().length === 0) {
    errorsValidation.push({ name: 'Name is required' });
  }

  if (is_online === undefined || is_online === null) {
    errorsValidation.push({ is_online: 'is_online is required' });
  }

  if (!event_date) {
    errorsValidation.push({ event_date: 'Event date is required' });
  } else {
    const date = new Date(event_date);
    if (isNaN(date.getTime())) {
      errorsValidation.push({ event_date: 'Invalid event date format' });
    }
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
