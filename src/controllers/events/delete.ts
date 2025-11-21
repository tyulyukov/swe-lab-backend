import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const jwtPayload = req.jwtPayload as JwtPayload;

  const eventRepository = getRepository(Event);
  try {
    const event = await eventRepository.findOne(id);

    if (!event) {
      const customError = new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
      return next(customError);
    }

    if (event.speaker_id !== jwtPayload.id) {
      const customError = new CustomError(403, 'General', 'Forbidden', ['Only the speaker can delete this event.']);
      return next(customError);
    }

    await eventRepository.delete(id);
    res.customSuccess(200, 'Event successfully deleted.', null);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error deleting event.', null, err);
    return next(customError);
  }
};
