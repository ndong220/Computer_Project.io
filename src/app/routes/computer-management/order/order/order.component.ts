import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import { BtnCellRenderComponent, DeleteModalComponent, PaymentTypeCellRenderComponent, StatusNameCellRenderComponent } from '@shared';
import {
  EXCEL_STYLES_DEFAULT,
  LIST_STATUS,
  LIST_STATUS_ORDER,
  OVERLAY_LOADING_TEMPLATE,
  OVERLAY_NOROW_TEMPLATE,
  PAGE_SIZE_OPTION_DEFAULT,
  QUERY_FILTER_DEFAULT,
} from '@util';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import PerfectScrollbar from 'perfect-scrollbar';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/computer-management/order/order.service';
import { OrderItemComponent } from '../order-item/order-item.component';
import { environment } from '@env/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less'],
})
export class OrderComponent implements OnInit {
  itemPrint;
  isPrint = false;
  baseFile = environment.BASE_FILE_URL;
  currentDate = new Date();
  constructor(
    private orderService: OrderService,
    private aclService: ACLService,
    private notification: NzNotificationService,
    private elementRef: ElementRef,
  ) {
    //#region ag-grid
    this.columnDefs = [
      {
        field: 'index',
        headerName: 'STT',
        width: 50,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
      },
      { field: 'code', headerName: 'Mã', minWidth: 100 },
      { field: 'name', headerName: 'Tên', sortable: true, filter: true, minWidth: 100, flex: 1 },
      { field: 'email', headerName: 'Email', sortable: true, filter: true, minWidth: 100, flex: 1 },
      { field: 'grandTotalFix', headerName: 'Tổng tiền', sortable: true, filter: true, minWidth: 100, flex: 1 },
      { field: 'orderDate', headerName: 'Ngày đặt', sortable: true, filter: true, minWidth: 100, flex: 1 },
      {
        field: 'phuongThucThanhToan',
        headerName: 'Phương thức thanh toán',
        sortable: true,
        filter: true,
        minWidth: 100,
        flex: 1,
        cellRenderer: 'paymentCellRender',
      },
      { field: 'statusName', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusNameCellRender' },
      {
        headerName: 'Thao tác',
        minWidth: 150,
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          infoClicked: (item: any) => this.onViewItem(item),
          editClicked: (item: any) => this.onEditItem(item),
          deleteClicked: (item: any) => this.onDeleteItem(item),
          printClicked: (item: any) => this.printOrder(item),
        },
      },
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 100,
      resizable: true,
    };
    this.frameworkComponents = {
      paymentCellRender: PaymentTypeCellRenderComponent,
      btnCellRenderer: BtnCellRenderComponent,
      statusNameCellRender: StatusNameCellRenderComponent,
    };
    this.excelStyles = [...EXCEL_STYLES_DEFAULT];
    //#endregion ag-grid

    //#region Init button
    this.btnAdd = {
      title: 'Thêm mới',
      titlei18n: '',
      visible: false,
      enable: false,
      grandAccess: false,
      click: ($event: any) => {
        this.onAddItem();
      },
    };
    this.btnExportExcel = {
      title: 'Export excel',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onExportExcel();
      },
    };
    this.btnDelete = {
      title: 'Xóa',
      titlei18n: '',
      visible: false,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onDeleteItem();
      },
    };
    this.btnSearch = {
      title: 'Tìm kiếm',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.initGridData();
      },
    };
    this.btnResetSearch = {
      title: 'Đặt lại',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onResetSearch(false);
      },
    };
    this.btnReload = {
      title: 'Tải lại',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.onResetSearch(true);
      },
    };
    //#endregion Init button
  }

  @ViewChild(OrderItemComponent, { static: false }) itemModal!: { initData: (arg0: {}, arg1: string) => void };
  @ViewChild(DeleteModalComponent, { static: false }) deleteModal!: {
    initData: (arg0: any, arg1: string) => void;
    updateIsLoading: (arg0: boolean) => void;
    updateData: (arg0: undefined) => void;
  };

  isRenderComplete = false;
  listCategory = [];
  listStatus = LIST_STATUS_ORDER;
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageSizeOptions: any[] = [];
  paginationMessage = '';

  columnDefs: any[] = [];
  grid: GridModel = {
    dataCount: 0,
    rowData: [],
    totalData: 0,
  };
  private gridApi: any;
  private gridColumnApi: any;
  modules = [ClientSideRowModelModule];
  defaultColDef: any;
  rowSelection = 'multiple';
  overlayLoadingTemplate = OVERLAY_LOADING_TEMPLATE;
  overlayNoRowsTemplate = OVERLAY_NOROW_TEMPLATE;
  quickText = '';
  excelStyles: any;
  frameworkComponents: any;

  btnAdd: ButtonModel;
  btnDelete: ButtonModel;
  btnExportExcel: ButtonModel;
  btnResetSearch: ButtonModel;
  btnSearch: ButtonModel;
  btnReload: ButtonModel;

  isLoadingDelete = false;
  isShowDelete = false;
  isShowImport = false;

  tittle = 'Danh sách đơn đặt';
  moduleName = 'Đơn đặt';

  modal: any = {
    type: '',
    item: {},
    isShow: false,
    option: {},
  };

  ngOnInit(): void {
    if (this.listCategory.length === 0) {
      this.fecthListCategory();
    }
    this.initRightOfUser();
    this.isRenderComplete = true;
  }

  initRightOfUser(): void {
    // this.btnAdd.grandAccess = this.aclService.canAbility('UNIT-ADD');
    // this.btnDelete.grandAccess = this.aclService.canAbility('UNIT-DELETE');
    // this.btnExportExcel.grandAccess = this.aclService.canAbility('UNIT-EXPORT-EXCEL');
  }

  //#region Ag-grid
  onPageSizeChange(): void {
    this.initGridData();
  }
  fecthListCategory(): void {
    this.orderService.getListCombobox().subscribe(
      (res: any) => {
        const dataResult = res.data;
        this.listCategory = dataResult;
      },
      (err: any) => {
        console.log(err);
      },
    );
  }
  onPageNumberChange(): void {
    this.initGridData();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.approvePerfectScrollbar();
    this.initGridData();
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

  onSelectionChanged($event: any): void {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      this.btnDelete.visible = true;
    } else {
      this.btnDelete.visible = false;
    }
  }

  onCellDoubleClicked($event: any): void {
    this.onViewItem($event.data);
  }
  //#endregion Ag-grid

  //#region Search

  //#endregion Search

  //#region Event
  onExportExcel(): void {
    const params = {
      columnWidth: 100,
      sheetName: this.moduleName,
      exportMode: undefined, // 'xml', // : undefined,
      suppressTextAsCDATA: true,
      rowHeight: undefined,
      fileName: `Danh sách ${this.moduleName} ${moment(new Date()).format('DD-MM-YYYY')}.xlsx`,
      headerRowHeight: undefined, // undefined,
      customHeader: [
        [],
        [
          {
            styleId: 'bigHeader',
            data: {
              type: 'String',
              value: `Danh sách ${this.moduleName} (${moment(new Date()).format('DD-MM-YYYY')})`,
            },
            mergeAcross: 3,
          },
        ],
        [],
      ],
      customFooter: [[]],
    };
    this.gridApi.exportDataAsExcel(params);
  }
  onResetSearch(reloadData: boolean): void {
    this.filter.textSearch = undefined;
    this.filter.status = null;
    this.filter.parentId = null;
    if (reloadData) {
      this.initGridData();
    }
  }

  onAddItem(): void {
    this.modal = {
      type: 'add',
      item: {},
      isShow: true,
      option: {},
    };
    this.itemModal.initData({}, 'add');
  }

  onEditItem(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: 'edit',
      item,
      isShow: true,
      option: {},
    };
    this.itemModal.initData(item, 'edit');
  }
  printOrder(item: any) {
    this.itemPrint = item;
    this.itemPrint.listProducts = JSON.parse(item.listProducts);
    setTimeout(function () {
      let mywindow = window.open('', 'PRINT', 'height=' + screen.height + ',width=' + screen.width + ' fullscreen=yes');
      mywindow?.document.write('<html>');
      mywindow?.document.write('<head>');
      mywindow?.document.write(
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0-11/css/all.min.css">',
      );
      mywindow?.document.write(
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css">',
      );

      mywindow?.document.write('<title>Hóa đơn: ' + item.code + ' </title>');
      mywindow?.document.write(
        '<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&amp;display=swap" rel="stylesheet">',
      );
      mywindow?.document.write('<link rel="stylesheet" href="../../../../../assets/css/styleprint.css">');
      mywindow?.document.write('<script src="../../../../../assets/js/print.js"></script>');
      mywindow?.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');
      mywindow?.document.write(
        '<script media="all" src="<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js" integrity="sha384-+YQ4JLhjyBLPDQt//I+STsc9iw4uQqACwlvpslubQzn4u2UU2UFM80nGisd026JF" crossorigin="anonymous"></script>',
      );
      mywindow?.document.write('</head>');
      mywindow?.document.write('<body >');
      let x = document.getElementById('pdf')?.innerHTML;
      if (x) {
        mywindow?.document.write(x);
      }
      mywindow?.document.write('</body></html>');
      mywindow?.document.close(); // necessary for IE >= 10
      mywindow?.focus(); // necessary for IE >= 10*/
      let title = mywindow?.document.title;
      title = 'HoaDon' + item.code + new Date().toLocaleString();
      mywindow?.print();
    }, 1000);
  }
  onViewItem(item: any = null): void {
    if (item === null) {
      const selectedRows = this.gridApi.getSelectedRows();
      item = selectedRows[0];
    }
    this.modal = {
      type: 'info',
      item,
      isShow: true,
      option: {},
    };
    this.itemModal.initData(item, 'info');
  }
  onDeleteItem(item: any = null): void {
    let selectedRows = this.gridApi.getSelectedRows();
    if (item !== null) {
      selectedRows = [];
      selectedRows.push(item);
    }
    const tittle = 'Xác nhận xóa';
    let content = '';
    if (selectedRows.length > 1) {
      content = 'Bạn có chắc chắn muốn xóa các bản ghi này không?';
    } else {
      content = 'Bạn có chắc chắn muốn xóa bản ghi này không?';
    }
    this.isShowDelete = true;
    this.deleteModal.initData(selectedRows, content);
  }

  //#endregion Event

  //#region Modal

  onModalEventEmmit(event: any): void {
    this.modal.isShow = false;
    if (event.type === 'success') {
      this.initGridData();
    }
  }

  onDeleteEventEmmit(event: any): void {
    if (event.type === 'success') {
      this.initGridData();
    } else if (event.type === 'confirm') {
      this.deleteModal.updateIsLoading(true);
      this.deleteListItem(event.listId);
    }
  }

  onImportEventEmmit(event: any): void {
    if (event.type === 'success') {
      this.initGridData();
    }
  }

  //#endregion Modal

  //#region API Event
  deleteListItem(listId: [string]): Subscription {
    this.isLoadingDelete = true;
    const promise = this.orderService.delete(listId).subscribe(
      (res: any) => {
        this.isLoadingDelete = false;
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        const dataResult = res.data;
        this.deleteModal.updateData(dataResult);
      },
      (err: any) => {
        this.isLoadingDelete = false;
        this.deleteModal.updateData(undefined);
        if (err.error) {
          this.notification.error(`Có lỗi xảy ra`, `${err.error.message}`);
        } else {
          this.notification.error(`Có lỗi xảy ra`, `${err.status}`);
        }
      },
    );
    return promise;
  }

  initGridData(): Subscription {
    this.btnDelete.visible = false;
    this.gridApi.showLoadingOverlay();
    const rs = this.orderService.getFilter(this.filter).subscribe(
      (res: any) => {
        this.gridApi.hideOverlay();
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }

        const dataResult = res.data;

        let i =
          (this.filter.pageSize === undefined ? 0 : this.filter.pageSize) *
          ((this.filter.pageNumber === undefined ? 0 : this.filter.pageNumber) - 1);

        this.paginationMessage = `Hiển thị <b>${i + 1} - ${i + dataResult.dataCount}</b> trên tổng số <b>${
          dataResult.totalCount
        }</b> kết quả`;
        for (const item of dataResult.data) {
          item.index = ++i;
          item.statusName = this.listStatus.find((x: any) => x.id === item.status)?.name;
          item.grandTotalFix = item.grandTotal.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, '$&,') + 'đ';
          item.editGrantAccess = true;
          const date = new Date(item.createdDate);
          item.orderDate =
            date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
          item.deleteGrantAccess = true;
          item.infoGrantAccess = true;
          item.printGrantAccess = true;
        }
        this.grid.totalData = dataResult.totalCount;
        this.grid.dataCount = dataResult.dataCount;
        this.grid.rowData = dataResult.data;
        this.pageSizeOptions = [...PAGE_SIZE_OPTION_DEFAULT];
        // tslint:disable-next-line: variable-name
        this.pageSizeOptions = this.pageSizeOptions.filter((number) => {
          return number < dataResult.totalCount;
        });
        this.pageSizeOptions.push(dataResult.totalCount);
      },
      (err: any) => {
        this.gridApi.hideOverlay();
        // console.log(err);
      },
    );
    return rs;
  }
  //#endregion API Event
}
