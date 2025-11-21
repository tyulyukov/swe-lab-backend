import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, is_online, event_date, location, link, description, image_urls, tags, limit_participants } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  const eventRepository = getRepository(Event);
  try {
    const event = await eventRepository.findOne(id);

    if (!event) {
      const customError = new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
      return next(customError);
    }

    if (event.speaker_id !== jwtPayload.id) {
      const customError = new CustomError(403, 'General', 'Forbidden', ['Only the speaker can edit this event.']);
      return next(customError);
    }

    if (name) event.name = name;
    if (is_online !== undefined) event.is_online = is_online;
    if (event_date) event.event_date = new Date(event_date);
    if (location !== undefined) event.location = location;
    if (link !== undefined) event.link = link;
    if (description !== undefined) event.description = description;
    if (image_urls !== undefined) event.image_urls = image_urls;
    if (tags !== undefined) event.tags = tags;
    if (limit_participants !== undefined) event.limit_participants = limit_participants;

    await eventRepository.save(event);
    res.customSuccess(200, 'Event successfully updated.', event);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error updating event.', null, err);
    return next(customError);
  }
};
