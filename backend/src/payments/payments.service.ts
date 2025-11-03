import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Transaction, TransactionDocument, TransactionType, TransactionStatus, PaymentProvider } from '../schemas/transaction.schema';
import { SessionsService } from '../sessions/sessions.service';
import { Session } from '../schemas/session.schema';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private sessionsService: SessionsService,
    private configService: ConfigService,
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  async createPayment(sessionId: string, userId: string) {
    const session = await this.sessionsService.findOne(sessionId);

    if (session.clientId.toString() !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (session.isPaid) {
      throw new BadRequestException('Session already paid');
    }

    if (session.status !== 'completed') {
      throw new BadRequestException('Session must be completed before payment');
    }

    // Create Stripe payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(session.totalCost * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        sessionId: sessionId,
        userId: userId,
        expertId: session.expertId.toString(),
      },
    });

    // Create transaction record
    const transaction = await this.transactionModel.create({
      sessionId,
      userId,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      amount: session.totalCost,
      currency: 'usd',
      provider: PaymentProvider.STRIPE,
      providerTransactionId: paymentIntent.id,
      description: `Payment for session ${sessionId}`,
    });

    return {
      transactionId: transaction._id,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const transaction = await this.transactionModel.findOne({
      providerTransactionId: paymentIntentId,
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (paymentIntent.status === 'succeeded') {
      transaction.status = TransactionStatus.COMPLETED;
      await transaction.save();

      // Update session payment status
      if (transaction.sessionId) {
        await this.sessionsService.updatePayment(transaction.sessionId.toString(), transaction._id.toString());
      }

      return transaction;
    }

    if (paymentIntent.status === 'canceled' || 
        (paymentIntent.status as string) === 'payment_failed' ||
        (paymentIntent.status as string) === 'requires_payment_method') {
      transaction.status = TransactionStatus.FAILED;
      await transaction.save();
    }

    return transaction;
  }

  async handleWebhook(payload: any, signature: string) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.confirmPayment(paymentIntent.id);
    }

    return { received: true };
  }

  async getTransaction(id: string) {
    const transaction = await this.transactionModel.findById(id).populate('sessionId').exec();
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async getUserTransactions(userId: string) {
    return this.transactionModel.find({ userId }).populate('sessionId').sort({ createdAt: -1 }).exec();
  }
}

