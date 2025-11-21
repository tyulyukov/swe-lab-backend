import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { EventRegistration } from 'orm/entities/events/EventRegistration';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id } = req.params;
  const user_id = req.jwtPayload.id;

  const eventRegistrationRepository = getRepository(EventRegistration);
  try {
    const registration = await eventRegistrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.event', 'event')
      .leftJoinAndSelect('registration.user', 'user')
      .select([
        'registration',
        'event',
        'user.id',
        'user.email',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.avatar_url',
        'user.position',
        'user.contact_info',
        'user.short_description',
        'user.status',
        'user.created_at',
      ])
      .where('registration.event_id = :event_id', { event_id })
      .andWhere('registration.user_id = :user_id', { user_id })
      .getOne();

    if (!registration) {
      const customError = new CustomError(404, 'General', 'Registration not found.', ['Registration not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Registration found', registration);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
