import { Request, Response, NextFunction } from 'express';

import { EventService } from 'services/EventService';
import { JwtPayload } from 'types/JwtPayload';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const jwtPayload = req.jwtPayload as JwtPayload;

  try {
    const eventService = new EventService();
    await eventService.delete(id, jwtPayload.id);

    res.customSuccess(200, 'Event successfully deleted.', null);
  } catch (err) {
    if (err instanceof CustomError) {
      return next(err);
    }
    const customError = new CustomError(400, 'Raw', 'Error deleting event.', null, err);
    return next(customError);
  }
};
