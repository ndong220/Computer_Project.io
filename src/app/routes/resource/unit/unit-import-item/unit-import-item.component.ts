import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import PerfectScrollbar from 'perfect-scrollbar';
import { Observable, Observer, Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { EXCEL_STYLES_DEFAULT, OVERLAY_LOADING_TEMPLATE, OVERLAY_NOROW_TEMPLATE, stringToBoolean } from '@util';

import { ButtonModel, ExcelColumnMapping } from '@model';
import { UnitApiService } from '@service';
import { StatusImportCellRenderComponent, StatusNameCellRenderComponent } from '@shared';

@Component({
  selector: 'app-unit-import-item',
  templateUrl: './unit-import-item.component.html',
  styleUrls: ['./unit-import-item.component.less'],
})
export class UnitImportItemComponent implements OnInit {
  constructor(private messageService: NzMessageService, private unitService: UnitApiService, private elementRef: ElementRef) {
    //#region Button
    this.btnDownload = {
      title: 'Tải về mẫu',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onExportExcel();
      },
    };
    this.btnUpload = {
      title: 'Tải lên dữ liệu',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {},
    };
    this.btnReset = {
      title: 'Đặt lại',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onReset();
      },
    };
    this.btnSave = {
      title: 'Lưu',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.save();
      },
    };
    this.btnCancel = {
      title: 'Hủy',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancel();
      },
    };
    this.btnClose = {
      title: 'Đóng',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.handleCancel();
      },
    };
    //#endregion Button

    //#region Ag-grid
    this.columnDefs = [
      { field: 'index', headerName: 'STT', width: 70 },
      { field: 'name', headerName: 'Tên', editable: true, sortable: true, filter: true, minWidth: 180, flex: 1 },
      { field: 'status', headerName: 'Trạng thái', editable: true, cellRenderer: 'statusNameCellRender', minWidth: 150 },
      { field: 'order', headerName: 'Thứ tự sắp xếp', editable: true, sortable: true },
    ];
    this.defaultColDef = {
      minWidth: 100,
      resizable: true,
    };
    this.frameworkComponents = {
      statusCellRender: StatusImportCellRenderComponent,
      statusNameCellRender: StatusNameCellRenderComponent,
    };
    this.excelStyles = [...EXCEL_STYLES_DEFAULT];
    //#endregion Ag-grid
  }
  @Input() isVisible = false;
  @Output() eventEmmit = new EventEmitter<any>();

  option: any;

  tittle = 'Nhập dữ liệu đơn vị tính từ excel';
  moduleName = 'Đơn vị tính';

  isLoading = false;

  gridApi: any;
  gridColumnApi: any;
  rowData: any[] = [];
  columnDefs: any;
  defaultColDef: any;
  excelStyles: any;
  frameworkComponents: any;
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;

  btnDownload: ButtonModel;
  btnUpload: ButtonModel;
  btnReset: ButtonModel;
  btnSave: ButtonModel;
  btnCancel: ButtonModel;
  btnClose: ButtonModel;

  isCompleteImport = false;
  jsonObject: any[] = [];
  excelColumnsMapping: ExcelColumnMapping[] = [
    {
      gridName: 'name',
      excelName: 'Tên',
      dataType: 'string',
    },
    {
      gridName: 'status',
      excelName: 'Trạng thái',
      dataType: 'boolean',
    },
    {
      gridName: 'order',
      excelName: 'Thứ tự sắp xếp',
      dataType: 'number',
    },
  ];

  ngOnInit(): void {}

  onExportExcel(): void {
    const params = {
      columnWidth: 100,
      sheetName: this.moduleName,
      exportMode: undefined, // 'xml', // : undefined,
      suppressTextAsCDATA: true,
      rowHeight: undefined,
      fileName: `Biểu mẫu nhập liệu ${this.moduleName}.xlsx`,
      headerRowHeight: undefined, // undefined,
      customHeader: [],
      customFooter: [],
    };
    this.gridApi.exportDataAsExcel(params);
  }

  onReset(): void {
    this.gridApi.setRowData([]);
  }

  //#region convertExcelData

  transformFile = (file: NzUploadFile) => {
    this.parseExcel(file);
    return new Observable((observer: Observer<Blob>) => {});
    // tslint:disable-next-line: semicolon
  };

  parseExcel(file: any): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, {
        type: 'binary',
      });
      workbook.SheetNames.forEach((sheetName) => {
        // Here is your object
        const XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        this.jsonObject = [...XL_row_object];
      });
      // console.log(this.jsonObject);

      const listObj: any[] = [];
      let i = 0;
      let check = false;
      this.jsonObject.forEach((itemExcel) => {
        const itemGrid: any = { index: ++i };
        check = false;
        this.excelColumnsMapping.forEach((col) => {
          this.convertExcelToGrid(itemGrid, itemExcel);
        });
        listObj.push(itemGrid);
      });

      // console.log(listObj);
      this.gridApi.setRowData(listObj);
      if (listObj.length === 0) {
        this.messageService.error(`Dữ liệu tải lên không phù hợp`);
      } else {
        this.messageService.success(`Tải lên dữ liệu thành công`);
      }
    };

    reader.onerror = (ex) => {
      this.messageService.error(`Tải lên dữ liệu thất bại - ${ex}`);
      // console.log(ex);
    };

    reader.readAsBinaryString(file);
  }

  convertExcelToGrid = (itemGrid: any, itemExcel: any): void => {
    this.excelColumnsMapping.forEach((col) => {
      if (col.dataType === 'string') {
        itemGrid[col.gridName!] = '' + itemExcel[col.excelName!];
      } else if (col.dataType === 'number') {
        itemGrid[col.gridName!] = parseFloat(itemExcel[col.excelName!]);
      } else if (col.dataType === 'boolean') {
        itemGrid[col.gridName!] = stringToBoolean(itemExcel[col.excelName!]);
      } else {
        itemGrid[col.gridName!] = itemExcel[col.excelName!];
      }
    });
    // tslint:disable-next-line:semicolon
  };

  ////#endregion convertExcelData

  //#region Ag-grid

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.hideOverlay();
    this.approvePerfectScrollbar();
  }

  approvePerfectScrollbar(): void {
    const agBodyViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-viewport');
    const agBodyHorizontalViewport: HTMLElement = this.elementRef.nativeElement.querySelector('.ag-body-horizontal-scroll-viewport');
    if (agBodyViewport) {
      const ps = new PerfectScrollbar(agBodyViewport);
      ps.update();
    }
    if (agBodyHorizontalViewport) {
      const ps = new PerfectScrollbar(agBodyHorizontalViewport);
      ps.update();
    }
  }

  //#endregion Ag-grid

  handleCancel(): void {
    this.isVisible = false;
    if (this.isCompleteImport) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  public initData(option: any = {}): void {
    this.option = option;
    this.isCompleteImport = false;
    this.isVisible = true;
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }

  //#region API Event

  save(): Subscription {
    this.isLoading = true;
    const data: any[] = [];
    // iterate through every node in the grid
    this.gridApi.forEachNode((rowNode: any, index: number) => {
      data.push(rowNode.data);
    });

    // console.log(data);

    if (data.length === 0) {
      this.isLoading = false;
      this.messageService.error(`Danh sách ${this.moduleName} không có dữ liệu!`);
      return new Subscription();
    }

    const promise = this.unitService.createMany(data).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.code !== 200) {
          this.messageService.error(`${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.messageService.error(`${res.message}`);
          return;
        }
        const dataResult = res.data;
        this.messageService.success(`${res.message}`);
        this.isCompleteImport = true;
      },
      (err: any) => {
        this.isLoading = false;
        if (err.error) {
          this.messageService.error(`${err.error.message}`);
        } else {
          this.messageService.error(`${err.status}`);
        }
      },
    );
    return promise;
  }

  //#endregion API Event
}
