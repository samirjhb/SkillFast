import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { Session, SessionSchema } from '../schemas/session.schema';
import { ExpertProfile, ExpertProfileSchema } from '../schemas/expert-profile.schema';
import { ExpertsModule } from '../experts/experts.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ExpertsModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: ExpertProfile.name, schema: ExpertProfileSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SessionsGateway],
  exports: [SessionsService, SessionsGateway],
})
export class SessionsModule {}

