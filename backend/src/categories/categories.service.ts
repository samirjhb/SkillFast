import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(categoryData: Partial<Category>) {
    return this.categoryModel.create(categoryData);
  }

  async findAll() {
    return this.categoryModel.find({ isActive: true }).exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateData: Partial<Category>) {
    return this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async remove(id: string) {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}

