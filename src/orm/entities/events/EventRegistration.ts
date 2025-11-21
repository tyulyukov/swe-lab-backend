import { Entity, Column, CreateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { User } from '../users/User';

import { Event } from './Event';

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryColumn({ type: 'uuid' })
  event_id: string;

  @PrimaryColumn({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => Event, (event) => event.registrations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
