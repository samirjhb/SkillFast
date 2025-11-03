import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <header>
        <nav>
          <div class="container">
            <div class="nav-content">
              <h1>SkillFast</h1>
              <div class="nav-links">
                <a routerLink="/">Inicio</a>
                <a routerLink="/experts">Expertos</a>
                <a *ngIf="!isAuthenticated" routerLink="/auth/login">Iniciar Sesión</a>
                <a *ngIf="!isAuthenticated" routerLink="/auth/register">Registrarse</a>
                <a *ngIf="isAuthenticated" routerLink="/dashboard">Dashboard</a>
                <a *ngIf="isAuthenticated" (click)="logout()" style="cursor: pointer;">Cerrar Sesión</a>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer>
        <div class="container">
          <p>&copy; 2024 SkillFast. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    nav {
      padding: 15px 0;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-content h1 {
      color: #007bff;
      font-size: 24px;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .nav-links a {
      text-decoration: none;
      color: #333;
      cursor: pointer;
    }
    .nav-links a:hover {
      color: #007bff;
    }
    main {
      flex: 1;
      padding: 20px 0;
    }
    footer {
      background: #333;
      color: #fff;
      padding: 20px 0;
      text-align: center;
      margin-top: auto;
    }
  `],
})
export class AppComponent {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
