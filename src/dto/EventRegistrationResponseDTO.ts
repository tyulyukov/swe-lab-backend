import { EventRegistration } from 'orm/entities/events/EventRegistration';

import { EventResponseDTO } from './EventResponseDTO';
import { UserResponseDTO } from './UserResponseDTO';

export class EventRegistrationResponseDTO {
  eventId: string;
  userId: string;
  comment: string | null;
  createdAt: Date;
  event?: EventResponseDTO;
  user?: UserResponseDTO;

  constructor(registration: EventRegistration, includeEvent = true, includeUser = true) {
    this.eventId = registration.event_id;
    this.userId = registration.user_id;
    this.comment = registration.comment;
    this.createdAt = registration.created_at;

    if (includeEvent && registration.event) {
      this.event = new EventResponseDTO(registration.event, false);
    }

    if (includeUser && registration.user) {
      this.user = new UserResponseDTO(registration.user);
    }
  }
}
