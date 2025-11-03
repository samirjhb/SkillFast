import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  async getAllUsers(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllUsers(page || 1, limit || 10);
  }

  @Get('experts')
  @ApiOperation({ summary: 'Obtener todos los expertos' })
  async getAllExperts(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllExperts(page || 1, limit || 10);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Obtener todas las sesiones' })
  async getAllSessions(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllSessions(page || 1, limit || 10);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  async getAllTransactions(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAllTransactions(page || 1, limit || 10);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Cambiar rol de usuario' })
  async updateUserRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.adminService.updateUserRole(id, body.role);
  }

  @Put('users/:id/deactivate')
  @ApiOperation({ summary: 'Desactivar usuario' })
  async deactivateUser(@Param('id') id: string) {
    return this.adminService.deactivateUser(id);
  }

  @Put('users/:id/activate')
  @ApiOperation({ summary: 'Activar usuario' })
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Put('experts/:id/verify')
  @ApiOperation({ summary: 'Verificar experto' })
  async verifyExpert(@Param('id') id: string) {
    return this.adminService.verifyExpert(id);
  }

  @Put('experts/:id/unverify')
  @ApiOperation({ summary: 'Desverificar experto' })
  async unverifyExpert(@Param('id') id: string) {
    return this.adminService.unverifyExpert(id);
  }
}

