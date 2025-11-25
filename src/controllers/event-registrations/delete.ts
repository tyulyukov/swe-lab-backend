import { Request, Response, NextFunction } from 'express';

import { EventRegistrationService } from 'services/EventRegistrationService';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.params;
  const jwtPayload = req.jwtPayload as JwtPayload;

  try {
    const registrationService = new EventRegistrationService();
    await registrationService.delete(event_id, jwtPayload.id);

    res.customSuccess(200, 'Registration successfully deleted.', null);
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error deleting registration.', null, err);
    return next(customError);
  }
};
