import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, is_online, event_date, location, link, description, image_urls, tags, limit_participants } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  const eventRepository = getRepository(Event);

  try {
    const event = new Event();
    event.speaker_id = jwtPayload.id;
    event.name = name;
    event.is_online = is_online;
    event.event_date = new Date(event_date);
    event.location = location || null;
    event.link = link || null;
    event.description = description || null;
    event.image_urls = image_urls || null;
    event.tags = tags || null;
    event.limit_participants = limit_participants || null;

    await eventRepository.save(event);

    res.customSuccess(201, 'Event successfully created.', event);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error creating event.', null, err);
    return next(customError);
  }
};
