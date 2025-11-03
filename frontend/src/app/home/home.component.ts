import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="container">
          <h1>Encuentra Expertos On-Demand</h1>
          <p>Conecta con profesionales certificados por videollamada, audio o chat</p>
          <button class="btn btn-primary" (click)="exploreExperts()">Explorar Expertos</button>
        </div>
      </section>
      <section class="features">
        <div class="container">
          <h2>¿Por qué SkillFast?</h2>
          <div class="features-grid">
            <div class="feature-card">
              <h3>⚡ Instantáneo</h3>
              <p>Conecta con expertos en minutos</p>
            </div>
            <div class="feature-card">
              <h3>💰 Transparente</h3>
              <p>Pago justo por minuto utilizado</p>
            </div>
            <div class="feature-card">
              <h3>⭐ Verificado</h3>
              <p>Todos nuestros expertos están verificados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 0;
      text-align: center;
    }
    .hero h1 {
      font-size: 48px;
      margin-bottom: 20px;
    }
    .hero p {
      font-size: 20px;
      margin-bottom: 30px;
    }
    .features {
      padding: 60px 0;
    }
    .features h2 {
      text-align: center;
      margin-bottom: 40px;
      font-size: 36px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
    }
    .feature-card {
      text-align: center;
      padding: 30px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .feature-card h3 {
      font-size: 24px;
      margin-bottom: 10px;
    }
  `],
})
export class HomeComponent {
  constructor(private router: Router) {}

  exploreExperts() {
    this.router.navigate(['/experts']);
  }
}
