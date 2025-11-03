import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpertProfile, ExpertProfileDocument } from '../schemas/expert-profile.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExpertsService {
  constructor(
    @InjectModel(ExpertProfile.name) private expertModel: Model<ExpertProfileDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, expertData: Partial<ExpertProfile>) {
    const user = await this.usersService.findOne(userId);
    if (user.role !== 'expert') {
      throw new BadRequestException('User must have expert role');
    }

    const existingProfile = await this.expertModel.findOne({ userId });
    if (existingProfile) {
      throw new BadRequestException('Expert profile already exists');
    }

    const expertProfile = await this.expertModel.create({
      userId,
      ...expertData,
    });

    return expertProfile;
  }

  async findAll(filters?: {
    category?: string;
    minRate?: number;
    maxRate?: number;
    minRating?: number;
    available?: boolean;
  }) {
    const query: any = {};

    if (filters?.category) {
      query.categories = filters.category;
    }

    if (filters?.minRate || filters?.maxRate) {
      query.ratePerMinute = {};
      if (filters.minRate) query.ratePerMinute.$gte = filters.minRate;
      if (filters.maxRate) query.ratePerMinute.$lte = filters.maxRate;
    }

    if (filters?.minRating) {
      query.averageRating = { $gte: filters.minRating };
    }

    if (filters?.available !== undefined) {
      query.isAvailable = filters.available;
    }

    const experts = await this.expertModel.find(query).populate('userId', 'firstName lastName email avatar').exec();

    return experts;
  }

  async findOne(id: string) {
    const expert = await this.expertModel.findById(id).populate('userId', 'firstName lastName email avatar').exec();
    if (!expert) {
      throw new NotFoundException('Expert profile not found');
    }
    return expert;
  }

  async findByUserId(userId: string) {
    const expert = await this.expertModel.findOne({ userId }).populate('userId').exec();
    if (!expert) {
      throw new NotFoundException('Expert profile not found');
    }
    return expert;
  }

  async update(id: string, updateData: Partial<ExpertProfile>) {
    return this.expertModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async updateByUserId(userId: string, updateData: Partial<ExpertProfile>) {
    return this.expertModel.findOneAndUpdate({ userId }, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    return this.expertModel.findByIdAndDelete(id).exec();
  }

  async updateRating(expertId: string, newRating: number) {
    const expert = await this.findOne(expertId);
    const totalReviews = expert.totalReviews + 1;
    const averageRating = ((expert.averageRating * expert.totalReviews) + newRating) / totalReviews;

    return this.update(expertId, {
      averageRating,
      totalReviews,
    });
  }

  async incrementSessionStats(expertId: string, minutes: number) {
    const expert = await this.expertModel.findById(expertId);
    if (expert) {
      expert.totalSessions += 1;
      expert.totalMinutes += minutes;
      await expert.save();
    }
  }
}

