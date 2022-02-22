import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AgGridModule } from 'ag-grid-angular';

import { ResourceRoutingModule } from './resource-routing.module';

import { UnitImportItemComponent } from './unit/unit-import-item/unit-import-item.component';
import { UnitItemComponent } from './unit/unit-item/unit-item.component';
import { UnitComponent } from './unit/unit/unit.component';
import { ImageCellRenderComponent } from './image-cell-render/image-cell-render.component';

@NgModule({
  declarations: [UnitComponent, UnitItemComponent, UnitImportItemComponent, ImageCellRenderComponent],
  imports: [SharedModule, CommonModule, ResourceRoutingModule, AgGridModule.withComponents([])],
})
export class ResourceModule {}
