import { Request, Response, NextFunction } from 'express';

import { EventResponseDTO } from 'dto/EventResponseDTO';
import { EventService } from 'services/EventService';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  try {
    const eventService = new EventService();
    const event = await eventService.findOne(id);

    res.customSuccess(200, 'Event found', new EventResponseDTO(event, true));
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
