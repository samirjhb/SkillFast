import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [SessionComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SessionsRoutingModule,
  ],
})
export class SessionsModule {}

