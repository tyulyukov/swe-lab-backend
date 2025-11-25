import { Request, Response, NextFunction } from 'express';

import { EventResponseDTO } from 'dto/EventResponseDTO';
import { EventService } from 'services/EventService';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const update = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, is_online, event_date, location, link, description, image_urls, tags, limit_participants } = req.body;
  const jwtPayload = req.jwtPayload as JwtPayload;

  try {
    const eventService = new EventService();
    const event = await eventService.update(id, jwtPayload.id, {
      name,
      is_online,
      event_date: event_date ? new Date(event_date) : undefined,
      location,
      link,
      description,
      image_urls,
      tags,
      limit_participants,
    });

    res.customSuccess(200, 'Event successfully updated.', new EventResponseDTO(event));
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error updating event.', null, err);
    return next(customError);
  }
};
