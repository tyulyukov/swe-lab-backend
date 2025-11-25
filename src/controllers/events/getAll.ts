import { Request, Response, NextFunction } from 'express';

import { EventResponseDTO } from 'dto/EventResponseDTO';
import { EventService } from 'services/EventService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventService = new EventService();
    const events = await eventService.findAll();
    const eventsDTO = events.map((event) => new EventResponseDTO(event, true));

    res.customSuccess(200, 'List of events.', eventsDTO);
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', `Can't retrieve list of events.`, null, err);
    return next(customError);
  }
};
