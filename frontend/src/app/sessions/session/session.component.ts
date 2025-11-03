import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-session',
  standalone: false,
  template: `
    <div class="session-container">
      <div class="session-header">
        <h2>Sesión {{ sessionType }}</h2>
        <p>Duración: {{ duration }}</p>
      </div>
      <div class="session-content">
        <div class="chat-area" *ngIf="sessionType === 'chat'">
          <div class="messages">
            <div *ngFor="let msg of messages" class="message">
              <strong>{{ msg.userId }}:</strong> {{ msg.message }}
            </div>
          </div>
          <div class="message-input">
            <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()">
            <button (click)="sendMessage()">Enviar</button>
          </div>
        </div>
        <div class="video-area" *ngIf="sessionType === 'video' || sessionType === 'audio'">
          <video id="localVideo" autoplay muted></video>
          <video id="remoteVideo" autoplay></video>
        </div>
      </div>
      <button (click)="endSession()" class="btn btn-danger">Finalizar Sesión</button>
    </div>
  `,
  styles: [`
    .session-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .session-header {
      margin-bottom: 20px;
    }
    .chat-area {
      display: flex;
      flex-direction: column;
      height: 600px;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #ddd;
      padding: 10px;
      margin-bottom: 10px;
    }
    .message {
      margin-bottom: 10px;
    }
    .message-input {
      display: flex;
      gap: 10px;
    }
    .message-input input {
      flex: 1;
    }
    .video-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    video {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
  `],
})
export class SessionComponent implements OnInit, OnDestroy {
  sessionId: string = '';
  sessionType: string = 'chat';
  duration: string = '0:00';
  messages: any[] = [];
  newMessage: string = '';
  socket!: Socket;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.params['id'];
    this.connectSocket();
    this.loadSession();
  }

  connectSocket() {
    const token = this.authService.getToken();
    this.socket = io('http://localhost:3000/sessions', {
      auth: { token },
    });

    this.socket.on('connect', () => {
      this.socket.emit('join-session', { sessionId: this.sessionId });
    });

    this.socket.on('chat-message', (data: any) => {
      this.messages.push(data);
    });

    this.socket.on('session-started', () => {
      this.startTimer();
    });
  }

  loadSession() {
    // TODO: Load session details from API
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.socket.emit('chat-message', {
        sessionId: this.sessionId,
        message: this.newMessage,
      });
      this.newMessage = '';
    }
  }

  startTimer() {
    // TODO: Implement timer logic
  }

  endSession() {
    // TODO: Implement end session logic
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

