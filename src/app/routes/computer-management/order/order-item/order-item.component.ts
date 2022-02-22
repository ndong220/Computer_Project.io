import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACLService } from '@delon/acl';
import { environment } from '@env/environment';
import { ButtonModel } from '@model';
import { LIST_STATUS_ORDER, supplierRouter } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/computer-management/order/order.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  moduleName = 'chi tiết đơn đặt';
  listTag: any[] = [];
  listStatusOrder = LIST_STATUS_ORDER;
  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';
  baseFile = environment.BASE_FILE_URL;
  listCart = [];
  parentId = '';
  isLoading = false;
  isReloadGrid = false;
  avatarUrl?: string;
  url?: string;
  loading = false;
  btnSave: ButtonModel;
  btnSaveAndCreate: ButtonModel;
  btnCancel: ButtonModel;
  btnEdit: ButtonModel;

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private orderService: OrderService,
    private aclService: ACLService,
  ) {
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
    this.btnSaveAndCreate = {
      title: 'Lưu & Thêm mới',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.save(true);
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
    this.btnEdit = {
      title: 'Cập nhật',
      titlei18n: '',
      visible: true,
      enable: true,
      grandAccess: true,
      click: ($event: any) => {
        this.updateFormToEdit();
      },
    };
    this.form = this.fb.group({
      code: [null, [Validators.required]],
      addressDetail: [null, [Validators.required]],
      city: [null, [Validators.required]],
      createdDate: [null, [Validators.required]],
      district: [null, [Validators.required]],
      grandTotal: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      paymentType: [null, [Validators.required]],
      status: [null, [Validators.required]],
      name: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      email: [null, [Validators.required]],
    });
  }
  uploadUrl = environment.BASE_UPLOAD_URL;
  handleCancel(): void {
    this.isVisible = false;
    if (this.isReloadGrid) {
      this.eventEmmit.emit({ type: 'success' });
    } else {
      this.eventEmmit.emit({ type: 'close' });
    }
  }

  ngOnInit(): void {
    this.initRightOfUser();
  }
  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.loading = false;
        // Get this url from response in real world.
        console.log(info);
        this.url = info.file.name;
        if (this.url) {
          this.avatarUrl = environment.BASE_FILE_URL + this.url;
          console.log(this.avatarUrl);
        }
        break;
      case 'error':
        this.messageService.error('Network error');
        this.loading = false;
        break;
    }
  }
  fecthlistTag(): void {
    this.orderService.getListCombobox().subscribe(
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
        this.listTag = dataResult;
        this.messageService.success(`${res.message}`);
        this.isReloadGrid = true;
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
  }
  initRightOfUser(): void {
    // this.btnSave.grandAccess = this.aclService.canAbility('UNIT-CREATE');
    // this.btnEdit.grandAccess = this.aclService.canAbility('UNIT-EDIT');
    // this.btnSaveAndCreate.grandAccess = this.aclService.canAbility('UNIT-CREATE');
  }

  updateFormToEdit(): void {
    this.updateFormType('edit');
    this.form.get('name')?.enable();
    this.form.get('status')?.enable();
  }

  updateFormType(type: string): void {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
      case 'info':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.tittle = `Chi tiết ${this.moduleName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.tittle = `Cập nhật ${this.moduleName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.tittle = `Thêm mới ${this.moduleName}`;
        break;
    }
  }

  public initData(data: any, type: any = null, option: any = {}): void {
    this.isLoading = false;
    this.isReloadGrid = false;
    this.item = data;
    this.listCart = JSON.parse(data.listProducts);
    this.type = type;
    this.option = option;
    this.updateFormType(type);
    if (this.item.id === null || this.item.id === undefined) {
      this.form = this.fb.group({
        code: [null, [Validators.required]],
        addressDetail: [null, [Validators.required]],
        city: [null, [Validators.required]],
        createdDate: [null, [Validators.required]],
        district: [null, [Validators.required]],
        grandTotal: [null, [Validators.required]],
        phoneNumber: [null, [Validators.required]],
        paymentType: [null, [Validators.required]],
        status: [null, [Validators.required]],
        name: [null, [Validators.required]],
        commune: [null, [Validators.required]],
        email: [null, [Validators.required]],
      });
    } else {
      this.parentId = this.item.parentId;
      this.form = this.fb.group({
        code: [this.item.code, [Validators.required]],
        addressDetail: [this.item.addressDetail, [Validators.required]],
        city: [this.item.city, [Validators.required]],
        createdDate: [this.item.createdDate, [Validators.required]],
        district: [this.item.district, [Validators.required]],
        grandTotal: [this.item.grandTotal, [Validators.required]],
        phoneNumber: [this.item.phoneNumber, [Validators.required]],
        paymentType: [this.item.phuongThucThanhToan, [Validators.required]],
        status: [{ value: this.item.status, disabled: this.item.status === 3 || this.item.status === -1 }, [Validators.required]],
        name: [this.item.name, [Validators.required]],
        commune: [this.item.commune, [Validators.required]],
        email: [this.item.email, [Validators.required]],
      });
    }
  }

  resetForm(): void {
    this.form.reset();
    this.form.get('status')?.setValue(true);
  }

  closeModalReloadData(): void {
    this.isVisible = false;
    this.eventEmmit.emit({ type: 'success' });
  }
  isNotSelected(value: string): boolean {
    if (value === this.parentId) {
      return false;
    }
    return true;
  }
  save(isCreateAfter: boolean = false): Subscription | undefined {
    this.isLoading = true;
    // tslint:disable-next-line:forin
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (!this.form.valid) {
      this.isLoading = false;
      this.messageService.error(`Kiểm tra lại thông tin các trường đã nhập!`);
      return;
    }
    let flag = false;
    let data = {
      id: this.item.id,
      status: this.form.controls.status.value,
    };

    if (this.isAdd) {
      const promise = this.orderService.create(data).subscribe(
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
          this.isReloadGrid = true;
          if (isCreateAfter) {
            this.resetForm();
          } else {
            this.closeModalReloadData();
          }
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
    } else if (this.isEdit) {
      const promise = this.orderService.updateStatusOrder(data).subscribe(
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
          this.messageService.success(`Cập nhật đơn hàng thành công`);
          this.closeModalReloadData();
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
    } else {
      return;
    }
  }
}
