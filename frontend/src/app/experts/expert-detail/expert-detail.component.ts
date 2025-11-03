import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-expert-detail',
  template: `
    <div class="expert-detail-container">
      <div class="container">
        <div class="expert-detail" *ngIf="expert">
          <h1>{{ expert.userId?.firstName }} {{ expert.userId?.lastName }}</h1>
          <p>{{ expert.bio }}</p>
          <div class="expert-info">
            <p><strong>Tarifa:</strong> ${{ expert.ratePerMinute }}/min</p>
            <p><strong>Rating:</strong> ⭐ {{ expert.averageRating || 'N/A' }}</p>
            <p><strong>Categorías:</strong> {{ expert.categories.join(', ') }}</p>
            <p><strong>Skills:</strong> {{ expert.skills.join(', ') }}</p>
          </div>
          <button class="btn btn-primary" (click)="startSession('chat')">Iniciar Chat</button>
          <button class="btn btn-primary" (click)="startSession('video')">Iniciar Videollamada</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expert-detail-container {
      padding: 40px 0;
    }
    .expert-detail {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .expert-info {
      margin: 20px 0;
    }
    .btn {
      margin-right: 10px;
    }
  `],
})
export class ExpertDetailComponent implements OnInit {
  expert: any;
  expertId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.expertId = this.route.snapshot.params['id'];
    this.loadExpert();
  }

  loadExpert() {
    this.http.get(`http://localhost:3000/api/experts/${this.expertId}`).subscribe({
      next: (data: any) => {
        this.expert = data;
      },
    });
  }

  startSession(type: string) {
    // TODO: Implement session start
    console.log('Starting session:', type);
  }
}

