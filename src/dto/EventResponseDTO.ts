import { Event } from 'orm/entities/events/Event';

import { EventRegistrationResponseDTO } from './EventRegistrationResponseDTO';
import { UserResponseDTO } from './UserResponseDTO';

export class EventResponseDTO {
  id: string;
  name: string;
  isOnline: boolean;
  eventDate: Date;
  location: string | null;
  link: string | null;
  description: string | null;
  imageUrls: string[] | null;
  tags: string[] | null;
  limitParticipants: number | null;
  createdAt: Date;
  speaker: UserResponseDTO | null;
  registrations?: EventRegistrationResponseDTO[];

  constructor(event: Event, includeRegistrations = false) {
    this.id = event.id;
    this.name = event.name;
    this.isOnline = event.is_online;
    this.eventDate = event.event_date;
    this.location = event.location;
    this.link = event.link;
    this.description = event.description;
    this.imageUrls = event.image_urls;
    this.tags = event.tags;
    this.limitParticipants = event.limit_participants;
    this.createdAt = event.created_at;
    this.speaker = event.speaker ? new UserResponseDTO(event.speaker) : null;

    if (includeRegistrations && event.registrations) {
      this.registrations = event.registrations.map((reg) => new EventRegistrationResponseDTO(reg, false, false));
    }
  }
}
