import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { event_date } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (event_date) {
    const date = new Date(event_date);
    if (isNaN(date.getTime())) {
      errorsValidation.push({ event_date: 'Invalid event date format' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit event validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
