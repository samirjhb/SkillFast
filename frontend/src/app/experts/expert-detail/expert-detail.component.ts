import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-expert-detail',
  standalone: false,
  templateUrl: './expert-detail.component.html',
  styleUrls: ['./expert-detail.component.css'],
})
export class ExpertDetailComponent implements OnInit {
  expert: any = null;
  expertId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
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
      error: (err) => {
        console.error('Error loading expert:', err);
      },
    });
  }

  startSession(type: string) {
    // TODO: Implement session start
    console.log('Starting session:', type);
  }
}
