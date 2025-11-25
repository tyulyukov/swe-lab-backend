import { getRepository, Repository } from 'typeorm';

import { Event } from 'orm/entities/events/Event';
import { EventRegistration } from 'orm/entities/events/EventRegistration';
import { CustomError } from 'utils/response/custom-error/CustomError';

interface CreateRegistrationData {
  event_id: string;
  user_id: string;
  comment?: string | null;
}

interface UpdateRegistrationData {
  comment?: string | null;
}

export class EventRegistrationService {
  private registrationRepository: Repository<EventRegistration>;
  private eventRepository: Repository<Event>;

  constructor() {
    this.registrationRepository = getRepository(EventRegistration);
    this.eventRepository = getRepository(Event);
  }

  async create(data: CreateRegistrationData): Promise<EventRegistration> {
    const event = await this.eventRepository.findOne(data.event_id, {
      relations: ['registrations'],
    });

    if (!event) {
      throw new CustomError(404, 'General', 'Event not found.', ['Event not found.']);
    }

    if (event.limit_participants && event.registrations.length >= event.limit_participants) {
      throw new CustomError(400, 'General', 'Event is full.', ['Event has reached maximum participants.']);
    }

    const existingRegistration = await this.registrationRepository.findOne({
      where: { event_id: data.event_id, user_id: data.user_id },
    });

    if (existingRegistration) {
      throw new CustomError(400, 'General', 'Already registered.', ['You are already registered for this event.']);
    }

    const registration = new EventRegistration();
    registration.event_id = data.event_id;
    registration.user_id = data.user_id;
    registration.comment = data.comment || null;

    await this.registrationRepository.save(registration);

    return this.findOne(data.event_id, data.user_id);
  }

  async findAll(userId: string): Promise<EventRegistration[]> {
    return this.registrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.event', 'event')
      .leftJoinAndSelect('registration.user', 'user')
      .select([
        'registration',
        'event',
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
      .where('registration.user_id = :user_id', { user_id: userId })
      .getMany();
  }

  async findOne(eventId: string, userId: string): Promise<EventRegistration> {
    const registration = await this.registrationRepository
      .createQueryBuilder('registration')
      .leftJoinAndSelect('registration.event', 'event')
      .leftJoinAndSelect('registration.user', 'user')
      .select([
        'registration',
        'event',
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
      .where('registration.event_id = :event_id', { event_id: eventId })
      .andWhere('registration.user_id = :user_id', { user_id: userId })
      .getOne();

    if (!registration) {
      throw new CustomError(404, 'General', 'Registration not found.', ['Registration not found.']);
    }

    return registration;
  }

  async update(eventId: string, userId: string, data: UpdateRegistrationData): Promise<EventRegistration> {
    const registration = await this.registrationRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (!registration) {
      throw new CustomError(404, 'General', 'Registration not found.', ['Registration not found.']);
    }

    if (data.comment !== undefined) registration.comment = data.comment;

    await this.registrationRepository.save(registration);

    return this.findOne(eventId, userId);
  }

  async delete(eventId: string, userId: string): Promise<void> {
    const registration = await this.registrationRepository.findOne({
      where: { event_id: eventId, user_id: userId },
    });

    if (!registration) {
      throw new CustomError(404, 'General', 'Registration not found.', ['Registration not found.']);
    }

    await this.registrationRepository.delete({ event_id: eventId, user_id: userId });
  }
}
