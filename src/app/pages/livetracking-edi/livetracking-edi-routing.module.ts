import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivetrackingEdiPage } from './livetracking-edi.page';

const routes: Routes = [
  {
    path: '',
    component: LivetrackingEdiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivetrackingEdiPageRoutingModule {}
