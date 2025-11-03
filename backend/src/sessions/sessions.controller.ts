import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SessionType } from '../schemas/session.schema';

@ApiTags('sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva sesión' })
  async create(@Req() req, @Body() body: { expertId: string; type: SessionType; description?: string }) {
    return this.sessionsService.create(req.user._id, body.expertId, body.type, body.description);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las sesiones del usuario' })
  async findAll(@Req() req) {
    return this.sessionsService.findAll(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener sesión por ID' })
  async findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }

  @Put(':id/start')
  @ApiOperation({ summary: 'Iniciar sesión' })
  async startSession(@Param('id') id: string) {
    return this.sessionsService.startSession(id);
  }

  @Put(':id/end')
  @ApiOperation({ summary: 'Finalizar sesión' })
  async endSession(@Param('id') id: string, @Body() body: { durationMinutes: number }) {
    return this.sessionsService.endSession(id, body.durationMinutes);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancelar sesión' })
  async cancelSession(@Param('id') id: string) {
    return this.sessionsService.cancelSession(id);
  }
}

