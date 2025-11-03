import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpertsListComponent } from './experts-list/experts-list.component';
import { ExpertDetailComponent } from './expert-detail/expert-detail.component';

const routes: Routes = [
  { path: '', component: ExpertsListComponent },
  { path: ':id', component: ExpertDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpertsRoutingModule {}

