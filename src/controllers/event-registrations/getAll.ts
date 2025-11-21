import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { EventRegistration } from 'orm/entities/events/EventRegistration';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const user_id = req.jwtPayload.id;

  const eventRegistrationRepository = getRepository(EventRegistration);
  try {
    const registrations = await eventRegistrationRepository
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
      .where('registration.user_id = :user_id', { user_id })
      .getMany();
    res.customSuccess(200, 'List of event registrations.', registrations);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of registrations.`, null, err);
    return next(customError);
  }
};
