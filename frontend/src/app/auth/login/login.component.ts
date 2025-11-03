import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Iniciar Sesión</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" required>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" required>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid">
            Iniciar Sesión
          </button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
        <p>¿No tienes cuenta? <a routerLink="/auth/register">Regístrate</a></p>
        <button (click)="loginWithGoogle()" class="btn btn-secondary">
          Iniciar con Google
        </button>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 40px 20px;
    }
    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-card h2 {
      margin-bottom: 30px;
      text-align: center;
      color: #333;
    }
    .btn {
      width: 100%;
      margin-top: 10px;
    }
  `],
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al iniciar sesión';
        },
      });
    }
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }
}

