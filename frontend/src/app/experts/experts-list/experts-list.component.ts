import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-experts-list',
  
  standalone: false,
  templateUrl: './experts-list.component.html',
  styleUrls: ['./experts-list.component.css'],
})
export class ExpertsListComponent implements OnInit {
  experts: any[] = [];
  categories: string[] = ['Technology', 'Business', 'Design', 'Marketing'];
  searchTerm: string = '';
  selectedCategory: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

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
    let params = new HttpParams();
    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory);
    }

    this.http.get('http://localhost:3000/api/experts', { params }).subscribe({
      next: (data: any) => {
        this.experts = data;
      },
      error: (err) => {
        console.error('Error searching experts:', err);
      },
    });
  }

  viewExpert(id: string) {
    this.router.navigate(['/experts', id]);
  }
}
