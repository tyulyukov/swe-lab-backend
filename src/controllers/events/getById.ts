import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const eventRepository = getRepository(Event);
  try {
    const event = await eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.speaker', 'speaker')
      .leftJoinAndSelect('event.registrations', 'registrations')
      .leftJoinAndSelect('registrations.user', 'user')
      .select([
        'event',
        'speaker.id',
        'speaker.email',
        'speaker.role',
        'speaker.first_name',
        'speaker.last_name',
        'speaker.avatar_url',
        'speaker.position',
        'speaker.contact_info',
        'speaker.short_description',
        'speaker.status',
        'speaker.created_at',
        'registrations',
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
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      const customError = new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Event found', event);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
