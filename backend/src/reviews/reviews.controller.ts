import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear review para sesión' })
  async create(@Req() req, @Body() body: { sessionId: string; rating: number; comment?: string }) {
    return this.reviewsService.create(body.sessionId, req.user._id, body.rating, body.comment);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reviews' })
  async findAll(@Query('expertId') expertId?: string) {
    return this.reviewsService.findAll(expertId);
  }

  @Get('expert/:expertId')
  @ApiOperation({ summary: 'Obtener reviews de un experto' })
  async getExpertReviews(@Param('expertId') expertId: string) {
    return this.reviewsService.getExpertReviews(expertId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener review por ID' })
  async findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar review' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.reviewsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar review' })
  async remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}

