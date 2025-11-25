import { Request, Response, NextFunction } from 'express';
import isUUID from 'validator/lib/isUUID';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.params;
  const errorsValidation: ErrorValidation[] = [];

  if (!isUUID(event_id)) {
    errorsValidation.push({ event_id: 'Event ID must be a valid UUID' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Update registration validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
