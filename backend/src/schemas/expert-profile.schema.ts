import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExpertProfileDocument = ExpertProfile & Document;

@Schema({ timestamps: true })
export class Availability {
  @Prop({ required: true })
  day: number; // 0-6 (Sunday-Saturday)

  @Prop({ required: true })
  startTime: string; // HH:mm

  @Prop({ required: true })
  endTime: string; // HH:mm
}

const AvailabilitySchema = SchemaFactory.createForClass(Availability);

@Schema({ timestamps: true })
export class ExpertProfile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  bio: string;

  @Prop({ type: [String], required: true })
  categories: string[];

  @Prop({ type: [String], required: true })
  skills: string[];

  @Prop({ required: true, min: 0 })
  ratePerMinute: number;

  @Prop({ type: [AvailabilitySchema], default: [] })
  availability: Availability[];

  @Prop({ default: 0 })
  totalSessions: number;

  @Prop({ default: 0 })
  totalMinutes: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [String], default: [] })
  languages: string[];

  @Prop()
  location?: string;

  @Prop({ type: [String], default: [] })
  education: string[];

  @Prop({ type: [String], default: [] })
  certifications: string[];
}

export const ExpertProfileSchema = SchemaFactory.createForClass(ExpertProfile);

