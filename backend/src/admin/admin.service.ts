import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { ExpertProfile, ExpertProfileDocument } from '../schemas/expert-profile.schema';
import { Session, SessionDocument } from '../schemas/session.schema';
import { Transaction, TransactionDocument } from '../schemas/transaction.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ExpertProfile.name) private expertModel: Model<ExpertProfileDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
  ) {}

  async getDashboardStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalClients = await this.userModel.countDocuments({ role: UserRole.CLIENT });
    const totalExperts = await this.userModel.countDocuments({ role: UserRole.EXPERT });
    const activeExperts = await this.expertModel.countDocuments({ isAvailable: true });
    const totalSessions = await this.sessionModel.countDocuments();
    const completedSessions = await this.sessionModel.countDocuments({ status: 'completed' });
    const totalTransactions = await this.transactionModel.countDocuments();
    const totalRevenue = await this.transactionModel.aggregate([
      { $match: { status: 'completed', type: 'payment' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return {
      users: {
        total: totalUsers,
        clients: totalClients,
        experts: totalExperts,
        activeExperts,
      },
      sessions: {
        total: totalSessions,
        completed: completedSessions,
      },
      transactions: {
        total: totalTransactions,
        revenue: totalRevenue[0]?.total || 0,
      },
    };
  }

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await this.userModel.find().skip(skip).limit(limit).exec();
    const total = await this.userModel.countDocuments();

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllExperts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const experts = await this.expertModel.find().skip(skip).limit(limit).populate('userId').exec();
    const total = await this.expertModel.countDocuments();

    return {
      data: experts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllSessions(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const sessions = await this.sessionModel.find().skip(skip).limit(limit).populate('clientId').populate('expertId').exec();
    const total = await this.sessionModel.countDocuments();

    return {
      data: sessions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllTransactions(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const transactions = await this.transactionModel.find().skip(skip).limit(limit).populate('userId').populate('sessionId').exec();
    const total = await this.transactionModel.countDocuments();

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserRole(userId: string, role: UserRole) {
    return this.usersService.changeRole(userId, role);
  }

  async deactivateUser(userId: string) {
    return this.usersService.deactivateUser(userId);
  }

  async activateUser(userId: string) {
    return this.usersService.activateUser(userId);
  }

  async verifyExpert(expertId: string) {
    return this.expertModel.findByIdAndUpdate(expertId, { isVerified: true }, { new: true }).exec();
  }

  async unverifyExpert(expertId: string) {
    return this.expertModel.findByIdAndUpdate(expertId, { isVerified: false }, { new: true }).exec();
  }
}

