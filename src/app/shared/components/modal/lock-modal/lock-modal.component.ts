import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GridModel } from '@model';

import { OVERLAY_LOADING_TEMPLATE, OVERLAY_NOROW_TEMPLATE } from '@util';
import { StatusDeleteCellRenderComponent } from '../../../ag-grid/cell-render/status-delete-cell-render/status-delete-cell-render.component';

@Component({
  selector: 'app-lock-modal',
  templateUrl: './lock-modal.component.html',
  styleUrls: ['./lock-modal.component.less'],
})
export class LockModalComponent implements OnInit {
  @Input() isVisible = false;
  @Output() eventEmmit = new EventEmitter<any>();

  message = '';

  isLoading = false;
  completeDelete = false;
  listItem: any[] = [];

  gridApi: any = {};
  gridColumnApi: any = {};
  columnDefs: any = {};
  defaultColDef: any = {};
  frameworkComponents: any = {};
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;

  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0,
  };

  constructor() {
    this.columnDefs = [
      { headerName: 'STT', field: 'index', width: 90 },
      { field: 'code', headerName: 'Mã', sortable: true, minWidth: 150, flex: 1 },
      { field: 'result', headerName: 'Trạng thái', cellRenderer: 'statusDeleteCellRender', width: 150 },
      { field: 'message', headerName: 'Mô tả', minWidth: 150, flex: 1 },
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 20,
      resizable: true,
    };
    this.frameworkComponents = {
      statusDeleteCellRender: StatusDeleteCellRenderComponent,
    };
  }

  handleCancel($event: any): void {
    this.isVisible = false;
    if (this.completeDelete) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  ngOnInit(): void {}

  public updateIsLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  public initData(data: any[], message: string = ''): void {
    this.isVisible = true;
    this.completeDelete = false;
    this.message = message;
    this.listItem = [];
    let i = 0;
    for (const item of data) {
      this.listItem.push({
        index: ++i,
        id: item.id,
        code: item.code,
        result: null,
        message: '',
      });
    }
    this.grid.rowData = [];
    this.grid.rowData = [...this.listItem];
  }

  public updateData(data: any[] = []): void {
    if (data === null || data === undefined || data.length === 0) {
      this.completeDelete = true;
      this.isLoading = false;
      for (const item of this.listItem) {
        item.result = false;
        item.message = 'Có lỗi xảy ra!';
      }
      this.grid.rowData = [];
      this.grid.rowData = [...this.listItem];
    } else {
      this.completeDelete = true;
      this.isLoading = false;
      for (const item of this.listItem) {
        const dt = data.find((x) => x.id === item.id);
        if (dt) {
          item.result = dt.result;
          item.message = dt.message;
        }
      }
      this.grid.rowData = [];
      this.grid.rowData = [...this.listItem];
    }
  }

  confirmDelete($event: any): void {
    this.eventEmmit.emit({ type: 'confirm', listId: this.listItem.map(({ id }) => id) });
  }

  closeModalReloadData($event: any): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.grid.rowData = this.listItem;
  }
}
