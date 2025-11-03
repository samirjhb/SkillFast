import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument, SessionStatus, SessionType } from '../schemas/session.schema';
import { ExpertsService } from '../experts/experts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private expertsService: ExpertsService,
    private usersService: UsersService,
  ) {}

  async create(clientId: string, expertId: string, type: SessionType, description?: string) {
    const expert = await this.expertsService.findByUserId(expertId);
    if (!expert.isAvailable) {
      throw new BadRequestException('Expert is not available');
    }

    const session = await this.sessionModel.create({
      clientId,
      expertId,
      type,
      status: SessionStatus.PENDING,
      ratePerMinute: expert.ratePerMinute,
      description,
    });

    return session;
  }

  async findAll(userId?: string) {
    const query: any = {};
    if (userId) {
      query.$or = [{ clientId: userId }, { expertId: userId }];
    }
    return this.sessionModel.find(query).populate('clientId', 'firstName lastName email').populate('expertId', 'firstName lastName email').exec();
  }

  async findOne(id: string) {
    const session = await this.sessionModel.findById(id).populate('clientId').populate('expertId').exec();
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async startSession(id: string) {
    const session = await this.findOne(id);
    if (session.status !== SessionStatus.PENDING) {
      throw new BadRequestException('Session cannot be started');
    }

    session.status = SessionStatus.ACTIVE;
    session.startedAt = new Date();
    await session.save();

    return session;
  }

  async endSession(id: string, durationMinutes: number) {
    const session = await this.findOne(id);
    if (session.status !== SessionStatus.ACTIVE) {
      throw new BadRequestException('Session is not active');
    }

    session.status = SessionStatus.COMPLETED;
    session.endedAt = new Date();
    session.durationMinutes = durationMinutes;
    session.totalCost = durationMinutes * session.ratePerMinute;

    await session.save();

    // Update expert stats
    await this.expertsService.incrementSessionStats(session.expertId.toString(), durationMinutes);

    return session;
  }

  async cancelSession(id: string) {
    const session = await this.findOne(id);
    if (session.status === SessionStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed session');
    }

    session.status = SessionStatus.CANCELLED;
    await session.save();

    return session;
  }

  async updatePayment(id: string, paymentId: string) {
    const session = await this.findOne(id);
    session.paymentId = paymentId;
    session.isPaid = true;
    await session.save();

    return session;
  }
}

