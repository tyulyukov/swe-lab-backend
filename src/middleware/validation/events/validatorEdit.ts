import { Request, Response, NextFunction } from 'express';
import isBoolean from 'validator/lib/isBoolean';
import isInt from 'validator/lib/isInt';
import isISO8601 from 'validator/lib/isISO8601';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const { event_date, is_online, limit_participants } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (event_date !== undefined && !isISO8601(event_date)) {
    errorsValidation.push({ event_date: 'Invalid event date format. Use ISO8601 format.' });
  }

  if (is_online !== undefined && !isBoolean(String(is_online))) {
    errorsValidation.push({ is_online: 'is_online must be a boolean value' });
  }

  if (limit_participants !== undefined && limit_participants !== null) {
    if (!isInt(String(limit_participants), { min: 1 })) {
      errorsValidation.push({ limit_participants: 'limit_participants must be a positive integer' });
    }
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit event validation error', null, null, errorsValidation);
    return next(customError);
  }
  return next();
};
