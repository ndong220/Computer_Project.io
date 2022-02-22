import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-image-cell-render',
  templateUrl: './image-cell-render.component.html',
  styleUrls: ['./image-cell-render.component.less'],
})
export class ImageCellRenderComponent implements ICellRendererAngularComp, OnInit, OnDestroy {
  params: any;
  constructor() {}
  ngOnDestroy() {
    // no need to remove the button click handler
    // https://stackoverflow.com/questions/49083993/does-angular-automatically-remove-template-event-listeners
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
  refresh(params: any): boolean {
    throw new Error('Method not implemented.');
  }
  agInit(params: any): void {
    this.params = params;
    this.params.value = environment.BASE_FILE_URL + this.params.value;
  }

  ngOnInit(): void {}
}
