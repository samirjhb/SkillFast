import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

export enum SessionType {
  CHAT = 'chat',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum SessionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  clientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  expertId: Types.ObjectId;

  @Prop({ type: String, enum: SessionType, required: true })
  type: SessionType;

  @Prop({ type: String, enum: SessionStatus, default: SessionStatus.PENDING })
  status: SessionStatus;

  @Prop()
  startedAt?: Date;

  @Prop()
  endedAt?: Date;

  @Prop({ default: 0 })
  durationMinutes: number;

  @Prop({ required: true, min: 0 })
  ratePerMinute: number;

  @Prop({ default: 0 })
  totalCost: number;

  @Prop()
  paymentId?: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Review' })
  reviewId?: Types.ObjectId;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

