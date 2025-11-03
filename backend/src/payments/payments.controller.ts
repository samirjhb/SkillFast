import { Controller, Get, Post, Body, Param, UseGuards, Req, Headers, RawBodyRequest, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear pago para sesión' })
  async createPayment(@Req() req, @Body() body: { sessionId: string }) {
    return this.paymentsService.createPayment(body.sessionId, req.user._id);
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirmar pago' })
  async confirmPayment(@Body() body: { paymentIntentId: string }) {
    return this.paymentsService.confirmPayment(body.paymentIntentId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de Stripe' })
  async handleWebhook(@Request() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    return this.paymentsService.handleWebhook(req.rawBody, signature);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Obtener transacciones del usuario' })
  async getUserTransactions(@Req() req) {
    return this.paymentsService.getUserTransactions(req.user._id);
  }

  @Get('transactions/:id')
  @ApiOperation({ summary: 'Obtener transacción por ID' })
  async getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }
}

