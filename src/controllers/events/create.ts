import { Request, Response, NextFunction } from 'express';

import { EventResponseDTO } from 'dto/EventResponseDTO';
import { EventService } from 'services/EventService';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const { name, is_online, event_date, location, link, description, image_urls, tags, limit_participants } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  try {
    const eventService = new EventService();
    const event = await eventService.create({
      speaker_id: jwtPayload.id,
      name,
      is_online,
      event_date: new Date(event_date),
      location,
      link,
      description,
      image_urls,
      tags,
      limit_participants,
    });

    res.customSuccess(201, 'Event successfully created.', new EventResponseDTO(event));
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error creating event.', null, err);
    return next(customError);
  }
};
