import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const eventRepository = getRepository(Event);
  try {
    const events = await eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.speaker', 'speaker')
      .leftJoinAndSelect('event.registrations', 'registrations')
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
      ])
      .getMany();
    res.customSuccess(200, 'List of events.', events);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of events.`, null, err);
    return next(customError);
  }
};
