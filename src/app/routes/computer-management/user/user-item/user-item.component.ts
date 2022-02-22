import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACLService } from '@delon/acl';
import { environment } from '@env/environment';
import { ButtonModel } from '@model';
import { UserApiService } from '@service';
import { supplierRouter } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.less'],
})
export class UserItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  moduleName = 'tài khoản';
  listTag: any[] = [];
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
    private userApiService: UserApiService,
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
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      name: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      phoneNumber: [null, [Validators.required]],
      birthdate: [null, Validators.required],
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
    this.avatarUrl = '';
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
        username: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        email: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: true, disabled: this.isInfo }],
        name: [null, [Validators.required]],
        phoneNumberPrefix: ['+84'],
        phoneNumber: [null, [Validators.required]],
        birthdate: [null, Validators.required],
      });
    } else {
      this.parentId = this.item.parentId;
      this.form = this.fb.group({
        code: [{ value: this.item.code, disabled: true }, [Validators.required]],
        name: [{ value: this.item.name, disabled: this.isInfo }, [Validators.required]],
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
    let data = {
      username: this.form.controls.username.value,
      email: this.form.controls.email.value,
      name: this.form.controls.name.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      birthDate: this.form.controls.birthdate.value,
      status: this.form.controls.status.value,
    };

    const promise = this.userApiService.create(data).subscribe(
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
  }
}
