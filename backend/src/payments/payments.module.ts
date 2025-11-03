import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { Session, SessionSchema } from '../schemas/session.schema';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    SessionsModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

