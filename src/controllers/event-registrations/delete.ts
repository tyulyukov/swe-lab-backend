import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { EventRegistration } from 'orm/entities/events/EventRegistration';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.params;
  const jwtPayload = req.jwtPayload as JwtPayload;

  const eventRegistrationRepository = getRepository(EventRegistration);
  try {
    const registration = await eventRegistrationRepository.findOne({
      where: { event_id, user_id: jwtPayload.id },
    });

    if (!registration) {
      const customError = new CustomError(404, 'General', 'Registration not found.', ['Registration not found.']);
      return next(customError);
    }

    await eventRegistrationRepository.delete({ event_id, user_id: jwtPayload.id });
    res.customSuccess(200, 'Registration successfully deleted.', null);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error deleting registration.', null, err);
    return next(customError);
  }
};
