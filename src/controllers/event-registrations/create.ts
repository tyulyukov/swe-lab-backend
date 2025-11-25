import { Request, Response, NextFunction } from 'express';

import { EventRegistrationResponseDTO } from 'dto/EventRegistrationResponseDTO';
import { EventRegistrationService } from 'services/EventRegistrationService';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id, comment } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  try {
    const registrationService = new EventRegistrationService();
    const registration = await registrationService.create({
      event_id,
      user_id: jwtPayload.id,
      comment,
    });

    res.customSuccess(201, 'Registration successfully created.', new EventRegistrationResponseDTO(registration));
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error creating registration.', null, err);
    return next(customError);
  }
};
