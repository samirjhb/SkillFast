import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <div class="container">
        <h1>Dashboard</h1>
        <div class="dashboard-content">
          <div class="card">
            <h3>Bienvenido, {{ user?.firstName }}!</h3>
            <p>Rol: {{ user?.role }}</p>
          </div>
          <div class="card">
            <h3>Mis Sesiones</h3>
            <p>Aquí verás tus sesiones activas y pasadas</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px 0;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}

