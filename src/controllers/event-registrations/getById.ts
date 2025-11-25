import { Request, Response, NextFunction } from 'express';

import { EventRegistrationResponseDTO } from 'dto/EventRegistrationResponseDTO';
import { EventRegistrationService } from 'services/EventRegistrationService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.params;
  const userId = req.jwtPayload.id;

  try {
    const registrationService = new EventRegistrationService();
    const registration = await registrationService.findOne(event_id, userId);

    res.customSuccess(200, 'Registration found', new EventRegistrationResponseDTO(registration));
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
