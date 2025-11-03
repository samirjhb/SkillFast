import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  PAYOUT = 'payout',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Session' })
  sessionId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ type: String, enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: String, enum: PaymentProvider })
  provider?: PaymentProvider;

  @Prop()
  providerTransactionId?: string;

  @Prop()
  description?: string;

  @Prop()
  metadata?: Record<string, any>;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

