import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ExpertsService } from './experts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('experts')
@Controller('experts')
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear perfil de experto' })
  async create(@Req() req, @Body() expertData: any) {
    return this.expertsService.create(req.user._id, expertData);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar expertos con filtros' })
  async findAll(
    @Query('category') category?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('minRating') minRating?: string,
    @Query('available') available?: string,
  ) {
    let availableBool: boolean | undefined = undefined;
    if (available !== undefined) {
      availableBool = available === 'true' || available === '1';
    }

    return this.expertsService.findAll({
      category,
      minRate: minRate ? Number(minRate) : undefined,
      maxRate: maxRate ? Number(maxRate) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      available: availableBool,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil de experto del usuario autenticado' })
  async getMyProfile(@Req() req) {
    return this.expertsService.findByUserId(req.user._id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar perfil de experto' })
  async updateMyProfile(@Req() req, @Body() updateData: any) {
    return this.expertsService.updateByUserId(req.user._id, updateData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener perfil de experto por ID' })
  async findOne(@Param('id') id: string) {
    return this.expertsService.findOne(id);
  }
}

