import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { EventRegistration } from 'orm/entities/events/EventRegistration';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { event_id, comment } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  const eventRegistrationRepository = getRepository(EventRegistration);
  const eventRepository = getRepository(Event);

  try {
    const event = await eventRepository.findOne(event_id, {
      relations: ['registrations'],
    });

    if (!event) {
      const customError = new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
      return next(customError);
    }

    if (event.limit_participants && event.registrations.length >= event.limit_participants) {
      const customError = new CustomError(400, 'General', 'Event is full.', [
        'Event has reached maximum participants.',
      ]);
      return next(customError);
    }

    const existingRegistration = await eventRegistrationRepository.findOne({
      where: { event_id, user_id: jwtPayload.id },
    });

    if (existingRegistration) {
      const customError = new CustomError(400, 'General', 'Already registered.', [
        'You are already registered for this event.',
      ]);
      return next(customError);
    }

    const registration = new EventRegistration();
    registration.event_id = event_id;
    registration.user_id = jwtPayload.id;
    registration.comment = comment || null;

    await eventRegistrationRepository.save(registration);

    const savedRegistration = await eventRegistrationRepository
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
      .andWhere('registration.user_id = :user_id', { user_id: jwtPayload.id })
      .getOne();

    res.customSuccess(201, 'Registration successfully created.', savedRegistration);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error creating registration.', null, err);
    return next(customError);
  }
};
