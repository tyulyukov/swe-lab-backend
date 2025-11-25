import { Request, Response, NextFunction } from 'express';

import { EventRegistrationResponseDTO } from 'dto/EventRegistrationResponseDTO';
import { EventRegistrationService } from 'services/EventRegistrationService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.jwtPayload.id;

  try {
    const registrationService = new EventRegistrationService();
    const registrations = await registrationService.findAll(userId);
    const registrationsDTO = registrations.map((reg) => new EventRegistrationResponseDTO(reg));

    res.customSuccess(200, 'List of event registrations.', registrationsDTO);
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of registrations.`, null, err);
    return next(customError);
  }
};
