import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Registrarse</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" formControlName="firstName" required>
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input type="text" formControlName="lastName" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" required>
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" formControlName="password" required>
          </div>
          <div class="form-group">
            <label>Tipo de cuenta</label>
            <select formControlName="role">
              <option value="client">Cliente</option>
              <option value="expert">Experto</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="registerForm.invalid">
            Registrarse
          </button>
          <p class="error" *ngIf="error">{{ error }}</p>
        </form>
        <p>¿Ya tienes cuenta? <a routerLink="/auth/login">Inicia sesión</a></p>
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
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['client'],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Error al registrarse';
        },
      });
    }
  }
}

