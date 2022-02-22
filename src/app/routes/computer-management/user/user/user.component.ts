import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ACLService } from '@delon/acl';
import { ButtonModel, GridModel, QueryFilerModel } from '@model';
import {
  BtnCellRenderComponent,
  DeleteModalComponent,
  IsQtvCellRenderComponent,
  LockModalComponent,
  QtvModalComponent,
  StatusNameCellRenderComponent,
} from '@shared';
import {
  EXCEL_STYLES_DEFAULT,
  LIST_STATUS,
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
import { UserService } from 'src/app/services/computer-management/user/user.service';
import { UserItemComponent } from '../user-item/user-item.component';
import { IsLockCellRenderComponent } from 'src/app/shared/ag-grid/cell-render/is-lock-cell-render/is-lock-cell-render.component';
import { IsAdminCellRenderComponent } from 'src/app/shared/ag-grid/cell-render/is-admin-cell-render/is-admin-cell-render.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
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
      {
        field: 'username',
        headerName: 'Tên tài khoản',
        sortable: true,
        minWidth: 180,
        flex: 1,
      },
      { field: 'isLock', headerName: 'Trạng thái', minWidth: 150, cellRenderer: 'statusV2CellRender' },
      { field: 'isAdmin', headerName: 'Loại tài khoản', minWidth: 150, cellRenderer: 'statusNameCellRender' },
      { field: 'isQtv', headerName: 'Quyền tài khoản', minWidth: 150, cellRenderer: 'statusQTVCellRender' },
      {
        headerName: 'Thao tác',
        minWidth: 150,
        cellRenderer: 'btnCellRenderer',
        cellRendererParams: {
          infoClicked: (item: any) => this.onViewItem(item),
          editClicked: (item: any) => this.onEditItem(item),
          deleteClicked: (item: any) => this.onDeleteItem(item),
          lockClicked: (item: any) => this.onLockItem(item),
          unlockClicked: (item: any) => this.onLockItem(item),
          qtvClicked: (item: any) => this.onChangeQtv(item),
          unQtvClicked: (item: any) => this.onChangeQtv(item),
        },
      },
    ];
    this.defaultColDef = {
      // flex: 1,
      minWidth: 100,
      resizable: true,
    };
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderComponent,
      statusV2CellRender: IsLockCellRenderComponent,
      statusNameCellRender: IsAdminCellRenderComponent,
      statusQTVCellRender: IsQtvCellRenderComponent,
    };
    this.excelStyles = [...EXCEL_STYLES_DEFAULT];
    //#endregion ag-grid

    //#region Init button
    this.btnAdd = {
      title: 'Cấp tài khoản Admin',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
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

  @ViewChild(UserItemComponent, { static: false }) itemModal!: { initData: (arg0: {}, arg1: string) => void };
  @ViewChild(LockModalComponent, { static: false }) deleteModal!: {
    initData: (arg0: any, arg1: string) => void;
    updateIsLoading: (arg0: boolean) => void;
    updateData: (arg0: undefined) => void;
  };
  @ViewChild(QtvModalComponent, { static: false }) changeRoleModal!: {
    initData: (arg0: any, arg1: string) => void;
    updateIsLoading: (arg0: boolean) => void;
    updateData: (arg0: undefined) => void;
  };
  isRenderComplete = false;
  listCategory = [];
  listStatus = LIST_STATUS;
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
  isLoadingQtv = false;
  isShowDelete = false;
  isShowQtv = false;
  isShowImport = false;

  tittle = 'Danh sách tài khoản';
  moduleName = 'tài khoản';

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
    this.userService.getListCombobox().subscribe(
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
      content = 'Bạn có chắc chắn muốn thay đổi trạng thái các bản ghi này không?';
    } else {
      content = 'Bạn có chắc chắn muốn thay đổi trạng thái bản ghi này không?';
    }
    this.isShowDelete = true;
    this.deleteModal.initData(selectedRows, content);
  }
  onLockItem(item: any = null): void {
    let selectedRows = this.gridApi.getSelectedRows();
    if (item !== null) {
      selectedRows = [];
      selectedRows.push(item);
    }
    const tittle = 'Xác nhận khóa tài khoản';
    let content = '';
    if (selectedRows.length > 1) {
      content = 'Bạn có chắc chắn muốn khóa các tài khoản này không?';
    } else {
      content = 'Bạn có chắc chắn muốn khóa tài khoản này không?';
    }
    this.isShowQtv = true;
    this.deleteModal.initData(selectedRows, content);
  }
  onChangeQtv(item: any = null): void {
    let selectedRows = this.gridApi.getSelectedRows();
    if (item !== null) {
      selectedRows = [];
      selectedRows.push(item);
    }
    const tittle = 'Xác nhận đặt quyền QTV cho tài khoản';
    let content = '';
    if (selectedRows.length > 1) {
      content = 'Bạn có chắc chắn muốn đặt quyền các tài khoản này không?';
    } else {
      content = 'Bạn có chắc chắn muốn đặt quyền tài khoản này không?';
    }
    this.isShowQtv = true;
    this.changeRoleModal.initData(selectedRows, content);
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
  onQtvEventEmmit(event: any): void {
    if (event.type === 'success') {
      this.initGridData();
    } else if (event.type === 'confirm') {
      this.changeRoleModal.updateIsLoading(true);
      this.changeQtvListItem(event.listId);
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
    const promise = this.userService.delete(listId).subscribe(
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
  changeQtvListItem(listId: [string]): Subscription {
    this.isLoadingQtv = true;
    const promise = this.userService.changeRole(listId).subscribe(
      (res: any) => {
        this.isLoadingQtv = false;
        if (res.code !== 200) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.notification.error(`Có lỗi xảy ra`, `${res.message}`);
          return;
        }
        const dataResult = res.data;
        this.changeRoleModal.updateData(dataResult);
      },
      (err: any) => {
        this.isLoadingQtv = false;
        this.changeRoleModal.updateData(undefined);
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
    const rs = this.userService.getFilter(this.filter).subscribe(
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
          item.editGrantAccess = false;
          item.deleteGrantAccess = false;
          item.lockGrantAccess = !item.isLock;
          item.unlockGrantAccess = item.isLock;

          item.qtvGrantAccess = !item.isQtv;
          item.unQtvGrantAccess = item.isQtv;
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
