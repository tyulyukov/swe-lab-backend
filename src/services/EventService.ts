import { getRepository, Repository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { CustomError } from 'utils/response/custom-error/CustomError';

interface CreateEventData {
  speaker_id: string;
  name: string;
  is_online: boolean;
  event_date: Date;
  location?: string | null;
  link?: string | null;
  description?: string | null;
  image_urls?: string[] | null;
  tags?: string[] | null;
  limit_participants?: number | null;
}

interface UpdateEventData {
  name?: string;
  is_online?: boolean;
  event_date?: Date;
  location?: string | null;
  link?: string | null;
  description?: string | null;
  image_urls?: string[] | null;
  tags?: string[] | null;
  limit_participants?: number | null;
}

export class EventService {
  private eventRepository: Repository<Event>;

  constructor() {
    this.eventRepository = getRepository(Event);
  }

  async create(data: CreateEventData): Promise<Event> {
    const event = new Event();
    event.speaker_id = data.speaker_id;
    event.name = data.name;
    event.is_online = data.is_online;
    event.event_date = data.event_date;
    event.location = data.location || null;
    event.link = data.link || null;
    event.description = data.description || null;
    event.image_urls = data.image_urls || null;
    event.tags = data.tags || null;
    event.limit_participants = data.limit_participants || null;

    await this.eventRepository.save(event);
    return event;
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.speaker', 'speaker')
      .leftJoinAndSelect('event.registrations', 'registrations')
      .select([
        'event',
        'speaker.id',
        'speaker.email',
        'speaker.role',
        'speaker.first_name',
        'speaker.last_name',
        'speaker.avatar_url',
        'speaker.position',
        'speaker.contact_info',
        'speaker.short_description',
        'speaker.status',
        'speaker.created_at',
        'registrations',
      ])
      .getMany();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.speaker', 'speaker')
      .leftJoinAndSelect('event.registrations', 'registrations')
      .leftJoinAndSelect('registrations.user', 'user')
      .select([
        'event',
        'speaker.id',
        'speaker.email',
        'speaker.role',
        'speaker.first_name',
        'speaker.last_name',
        'speaker.avatar_url',
        'speaker.position',
        'speaker.contact_info',
        'speaker.short_description',
        'speaker.status',
        'speaker.created_at',
        'registrations',
        'user.id',
        'user.email',
        'user.role',
        'user.first_name',
        'user.last_name',
        'user.avatar_url',
        'user.position',
        'user.contact_info',
        'user.short_description',
        'user.status',
        'user.created_at',
      ])
      .where('event.id = :id', { id })
      .getOne();

    if (!event) {
      throw new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
    }
    return event;
  }

  async update(id: string, speakerId: string, data: UpdateEventData): Promise<Event> {
    const event = await this.eventRepository.findOne(id);

    if (!event) {
      throw new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
    }

    if (event.speaker_id !== speakerId) {
      throw new CustomError(403, 'General', 'Forbidden', ['Only the speaker can edit this event.']);
    }

    if (data.name !== undefined) event.name = data.name;
    if (data.is_online !== undefined) event.is_online = data.is_online;
    if (data.event_date !== undefined) event.event_date = data.event_date;
    if (data.location !== undefined) event.location = data.location;
    if (data.link !== undefined) event.link = data.link;
    if (data.description !== undefined) event.description = data.description;
    if (data.image_urls !== undefined) event.image_urls = data.image_urls;
    if (data.tags !== undefined) event.tags = data.tags;
    if (data.limit_participants !== undefined) event.limit_participants = data.limit_participants;

    await this.eventRepository.save(event);
    return event;
  }

  async delete(id: string, speakerId: string): Promise<void> {
    const event = await this.eventRepository.findOne(id);

    if (!event) {
      throw new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
    }

    if (event.speaker_id !== speakerId) {
      throw new CustomError(403, 'General', 'Forbidden', ['Only the speaker can delete this event.']);
    }

    await this.eventRepository.delete(id);
  }
}
