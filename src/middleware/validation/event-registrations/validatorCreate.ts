import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreate = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (!event_id || event_id.trim().length === 0) {
    errorsValidation.push({ event_id: 'Event ID is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create registration validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }
  return next();
};
