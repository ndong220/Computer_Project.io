import { Component, OnInit } from '@angular/core';
import { StatusNameCellRenderComponent } from '@shared';
import { EXCEL_STYLES_DEFAULT } from '@util';
import { LoaderService } from 'src/app/services/core/loader.service';

// import 'ag-grid-enterprise';

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.less'],
})
export class AgGridComponent implements OnInit {
  columnDefs = [
    { headerName: '#', field: 'index', width: 70 },
    { field: 'make', headerName: 'Tên', sortable: true, filter: true, editable: true, minWidth: 180, flex: 1 },
    { field: 'status', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusNameCellRender' },
    {
      field: 'price',
      headerName: 'Giá',
      sortable: true,
      valueFormatter: (params: any) => this.currencyFormatter(params.value, '$ '),
    },
  ];
  rowData = [
    { index: 1, make: 'Toyota', status: 'Hoạt động', price: 35000 },
    { index: 2, make: 'Ford', status: 'Không hoạt động', price: 32000 },
    { index: 3, make: 'Porsche', status: 'Hoạt động', price: 72000 },
  ];
  gridApi: any;
  gridColumnApi: any;
  frameworkComponents: any;
  excelStyles: any;

  constructor(public loaderService: LoaderService) {
    this.frameworkComponents = {
      statusNameCellRender: StatusNameCellRenderComponent,
    };
    this.excelStyles = [...EXCEL_STYLES_DEFAULT];
  }

  ngOnInit(): void {
    // this.loaderService.isLoading.next(true);
  }

  onGridReady(params: any): void {
    // console.log(params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  // DATA FORMATTING
  currencyFormatter(currency: any, sign: string): string {
    const sansDec = currency.toFixed(0);
    const formatted = sansDec.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return sign + `${formatted}`;
  }
}
