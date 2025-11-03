import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  icon?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  expertCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

