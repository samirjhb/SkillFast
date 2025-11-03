import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateData: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  sanitizeUser(user: UserDocument) {
    const { password, refreshToken, ...sanitized } = user.toObject();
    return sanitized;
  }

  async getUserProfile(userId: string) {
    const user = await this.findOne(userId);
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, updateData: Partial<User>) {
    const { password, ...safeData } = updateData;
    return this.update(userId, safeData);
  }

  async changeRole(userId: string, role: UserRole) {
    return this.update(userId, { role });
  }

  async deactivateUser(userId: string) {
    return this.update(userId, { isActive: false });
  }

  async activateUser(userId: string) {
    return this.update(userId, { isActive: true });
  }
}

