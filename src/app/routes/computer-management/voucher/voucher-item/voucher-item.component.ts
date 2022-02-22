import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACLService } from '@delon/acl';
import { environment } from '@env/environment';
import { ButtonModel } from '@model';
import { VoucherService } from '@service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-voucher-item',
  templateUrl: './voucher-item.component.html',
  styleUrls: ['./voucher-item.component.less'],
})
export class VoucherItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  moduleName = 'mã giảm giá';
  listvoucher: any[] = [];
  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';
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
    private voucherService: VoucherService,
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
      code: [{ value: null, disabled: true }, [Validators.required]],
      discount: [{ value: null, disabled: false }, [Validators.required]],
      expiredDate: [{ value: null, disabled: false }, [Validators.required]],
      startDate: [{ value: null, disabled: false }, [Validators.required]],
      type: [{ value: null, disabled: false }, [Validators.required]],
      quantity: [{ value: null, disabled: false }, [Validators.required]],
      status: [true],
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
  fecthlistvoucher(): void {
    this.voucherService.getListCombobox().subscribe(
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
        this.listvoucher = dataResult;
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
    this.avatarUrl = '';
    if (this.listvoucher.length === 0) {
      this.fecthlistvoucher();
    }
    this.isLoading = false;
    this.isReloadGrid = false;
    this.item = data;
    this.type = type;
    this.option = option;
    if (this.item.avatarUrl) {
      this.avatarUrl = environment.BASE_FILE_URL + this.item.avatarUrl;
    }
    console.log(this.avatarUrl);
    this.updateFormType(type);
    if (this.item.id === null || this.item.id === undefined) {
      this.form = this.fb.group({
        code: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        discount: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        expiredDate: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        startDate: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        type: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        quantity: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: true, disabled: this.isInfo }],
      });
    } else {
      this.parentId = this.item.parentId;
      this.form = this.fb.group({
        code: [{ value: this.item.code, disabled: true }, [Validators.required]],
        discount: [{ value: this.item.discount, disabled: this.isInfo }, [Validators.required]],
        expiredDate: [{ value: this.item.expiredTime, disabled: this.isInfo }, [Validators.required]],
        startDate: [{ value: this.item.startTime, disabled: this.isInfo }, [Validators.required]],
        type: [{ value: this.item.type, disabled: this.isInfo }, [Validators.required]],
        quantity: [{ value: this.item.quantity, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: this.item.status, disabled: this.isInfo }],
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
      startTime: this.form.controls.startDate.value,
      expiredTime: this.form.controls.expiredDate.value,
      type: this.form.controls.type.value,
      code: this.form.controls.code.value,
      discount: this.form.controls.discount.value,
      quantity: this.form.controls.quantity.value,
      status: this.form.controls.status.value,
    };

    if (this.isAdd) {
      this.listvoucher.map((item) => {
        if (item.note === data.code) {
          this.isLoading = false;
          this.messageService.error(`Mã voucher đã tồn tại!`);
          flag = true;
          return;
        }
      });
      if (flag) {
        this.isLoading = false;
        return;
      }
      const promise = this.voucherService.create(data).subscribe(
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
      const promise = this.voucherService.update(data).subscribe(
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
