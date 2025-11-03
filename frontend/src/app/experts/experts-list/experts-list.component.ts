import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-experts-list',
  template: `
    <div class="experts-container">
      <div class="container">
        <h1>Buscar Expertos</h1>
        <div class="filters">
          <input type="text" placeholder="Buscar..." [(ngModel)]="searchTerm">
          <select [(ngModel)]="selectedCategory">
            <option value="">Todas las categorías</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
          <button (click)="search()" class="btn btn-primary">Buscar</button>
        </div>
        <div class="experts-grid">
          <div *ngFor="let expert of experts" class="expert-card" (click)="viewExpert(expert._id)">
            <h3>{{ expert.userId?.firstName }} {{ expert.userId?.lastName }}</h3>
            <p>{{ expert.bio }}</p>
            <p><strong>Tarifa:</strong> ${{ expert.ratePerMinute }}/min</p>
            <p><strong>Rating:</strong> ⭐ {{ expert.averageRating || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .experts-container {
      padding: 40px 0;
    }
    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .filters input,
    .filters select {
      flex: 1;
      min-width: 200px;
    }
    .experts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .expert-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .expert-card:hover {
      transform: translateY(-5px);
    }
  `],
})
export class ExpertsListComponent implements OnInit {
  experts: any[] = [];
  categories: string[] = ['Technology', 'Business', 'Design', 'Marketing'];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExperts();
  }

  loadExperts() {
    this.http.get('http://localhost:3000/api/experts').subscribe({
      next: (data: any) => {
        this.experts = data;
      },
      error: (err) => {
        console.error('Error loading experts:', err);
      },
    });
  }

  search() {
    const params: any = {};
    if (this.selectedCategory) params.category = this.selectedCategory;
    // Add more filters as needed

    this.http.get('http://localhost:3000/api/experts', { params }).subscribe({
      next: (data: any) => {
        this.experts = data;
      },
    });
  }

  viewExpert(id: string) {
    // Navigate to expert detail
    window.location.href = `/experts/${id}`;
  }
}

