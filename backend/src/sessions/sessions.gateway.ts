import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  },
  namespace: '/sessions',
})
export class SessionsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SessionsGateway');
  private activeSessions: Map<string, string> = new Map(); // sessionId -> roomId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private sessionsService: SessionsService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.userId = payload.sub;
      this.logger.log(`Client connected: ${client.id} (User: ${payload.sub})`);
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-session')
  async handleJoinSession(client: Socket, payload: { sessionId: string }) {
    const { sessionId } = payload;
    const userId = client.data.userId;

    try {
      const session = await this.sessionsService.findOne(sessionId);

      if (session.clientId.toString() !== userId && session.expertId.toString() !== userId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      const roomId = `session-${sessionId}`;
      client.join(roomId);
      this.activeSessions.set(sessionId, roomId);

      this.server.to(roomId).emit('user-joined', { userId, sessionId });
      this.logger.log(`User ${userId} joined session ${sessionId}`);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave-session')
  async handleLeaveSession(client: Socket, payload: { sessionId: string }) {
    const { sessionId } = payload;
    const userId = client.data.userId;
    const roomId = `session-${sessionId}`;

    client.leave(roomId);
    this.server.to(roomId).emit('user-left', { userId, sessionId });
    this.logger.log(`User ${userId} left session ${sessionId}`);
  }

  @SubscribeMessage('chat-message')
  async handleChatMessage(client: Socket, payload: { sessionId: string; message: string }) {
    const { sessionId, message } = payload;
    const userId = client.data.userId;
    const roomId = `session-${sessionId}`;

    this.server.to(roomId).emit('chat-message', {
      userId,
      sessionId,
      message,
      timestamp: new Date(),
    });
  }

  @SubscribeMessage('webrtc-offer')
  async handleWebRTCOffer(client: Socket, payload: { sessionId: string; offer: any }) {
    const { sessionId, offer } = payload;
    const userId = client.data.userId;
    const roomId = `session-${sessionId}`;

    client.to(roomId).emit('webrtc-offer', {
      userId,
      sessionId,
      offer,
    });
  }

  @SubscribeMessage('webrtc-answer')
  async handleWebRTCAnswer(client: Socket, payload: { sessionId: string; answer: any }) {
    const { sessionId, answer } = payload;
    const userId = client.data.userId;
    const roomId = `session-${sessionId}`;

    client.to(roomId).emit('webrtc-answer', {
      userId,
      sessionId,
      answer,
    });
  }

  @SubscribeMessage('webrtc-ice-candidate')
  async handleWebRTCIceCandidate(client: Socket, payload: { sessionId: string; candidate: any }) {
    const { sessionId, candidate } = payload;
    const userId = client.data.userId;
    const roomId = `session-${sessionId}`;

    client.to(roomId).emit('webrtc-ice-candidate', {
      userId,
      sessionId,
      candidate,
    });
  }

  @SubscribeMessage('session-started')
  async handleSessionStarted(client: Socket, payload: { sessionId: string }) {
    const { sessionId } = payload;
    const roomId = `session-${sessionId}`;

    await this.sessionsService.startSession(sessionId);
    this.server.to(roomId).emit('session-started', { sessionId });
  }

  @SubscribeMessage('session-ended')
  async handleSessionEnded(client: Socket, payload: { sessionId: string; durationMinutes: number }) {
    const { sessionId, durationMinutes } = payload;
    const roomId = `session-${sessionId}`;

    await this.sessionsService.endSession(sessionId, durationMinutes);
    this.server.to(roomId).emit('session-ended', { sessionId });
  }
}

