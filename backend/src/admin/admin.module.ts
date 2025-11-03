import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../schemas/user.schema';
import { ExpertProfile, ExpertProfileSchema } from '../schemas/expert-profile.schema';
import { Session, SessionSchema } from '../schemas/session.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ExpertProfile.name, schema: ExpertProfileSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

