import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitComponent } from './unit/unit/unit.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'unit', pathMatch: 'full' },
      { path: 'unit', component: UnitComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
