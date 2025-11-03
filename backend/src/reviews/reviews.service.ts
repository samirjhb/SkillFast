import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { SessionsService } from '../sessions/sessions.service';
import { ExpertsService } from '../experts/experts.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private sessionsService: SessionsService,
    private expertsService: ExpertsService,
  ) {}

  async create(sessionId: string, clientId: string, rating: number, comment?: string) {
    const session = await this.sessionsService.findOne(sessionId);

    if (session.clientId.toString() !== clientId) {
      throw new BadRequestException('Unauthorized');
    }

    if (session.status !== 'completed') {
      throw new BadRequestException('Can only review completed sessions');
    }

    if (session.reviewId) {
      throw new BadRequestException('Session already reviewed');
    }

    const review = await this.reviewModel.create({
      sessionId,
      clientId,
      expertId: session.expertId,
      rating,
      comment,
      isVisible: true,
    });

    // Update session with review
    session.reviewId = review._id as Types.ObjectId;
    await session.save();

    // Update expert rating
    await this.expertsService.updateRating(session.expertId.toString(), rating);

    return review;
  }

  async findAll(expertId?: string) {
    const query: any = { isVisible: true };
    if (expertId) {
      query.expertId = expertId;
    }

    return this.reviewModel
      .find(query)
      .populate('clientId', 'firstName lastName avatar')
      .populate('expertId', 'firstName lastName')
      .populate('sessionId', 'type durationMinutes')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id).populate('clientId').populate('expertId').populate('sessionId').exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(id: string, updateData: Partial<Review>) {
    return this.reviewModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async getExpertReviews(expertId: string) {
    return this.findAll(expertId);
  }
}

