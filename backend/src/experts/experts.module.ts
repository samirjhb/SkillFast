import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpertsController } from './experts.controller';
import { ExpertsService } from './experts.service';
import { ExpertProfile, ExpertProfileSchema } from '../schemas/expert-profile.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: ExpertProfile.name, schema: ExpertProfileSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ExpertsController],
  providers: [ExpertsService],
  exports: [ExpertsService],
})
export class ExpertsModule {}

