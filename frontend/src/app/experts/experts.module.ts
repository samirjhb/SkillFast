import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpertsRoutingModule } from './experts-routing.module';
import { ExpertsListComponent } from './experts-list/experts-list.component';
import { ExpertDetailComponent } from './expert-detail/expert-detail.component';

@NgModule({
  declarations: [ExpertsListComponent, ExpertDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ExpertsRoutingModule,
  ],
})
export class ExpertsModule {}

