import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACLService } from '@delon/acl';
import { ButtonModel } from '@model';
import { TagService } from '@service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.less'],
})
export class TagItemComponent implements OnInit {
  @Input() type = 'add';
  @Input() item: any;
  @Input() isVisible = false;
  @Input() option: any;
  @Output() eventEmmit = new EventEmitter<any>();

  form: FormGroup;
  moduleName = 'tag';
  listTag: any[] = [];
  isInfo = false;
  isEdit = false;
  isAdd = false;
  tittle = '';
  parentId = '';
  isLoading = false;
  isReloadGrid = false;

  btnSave: ButtonModel;
  btnSaveAndCreate: ButtonModel;
  btnCancel: ButtonModel;
  btnEdit: ButtonModel;

  constructor(
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private tagService: TagService,
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
      name: [null, [Validators.required]],
      url: [null, [Validators.required]],
      status: [true],
    });
  }

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
  fecthlistTag(): void {
    this.tagService.getListCombobox().subscribe(
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
    this.form.get('url')?.enable();
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
    if (this.listTag.length === 0) {
      this.fecthlistTag();
    }
    this.isLoading = false;
    this.isReloadGrid = false;
    this.item = data;
    this.type = type;
    this.option = option;
    this.updateFormType(type);
    if (this.item.id === null || this.item.id === undefined) {
      this.form = this.fb.group({
        code: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        name: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        url: [{ value: null, disabled: this.isInfo }, [Validators.required]],
        status: [{ value: true, disabled: this.isInfo }],
      });
    } else {
      this.parentId = this.item.parentId;
      this.form = this.fb.group({
        code: [{ value: this.item.code, disabled: true }, [Validators.required]],
        name: [{ value: this.item.name, disabled: this.isInfo }, [Validators.required]],
        url: [{ value: this.item.uri, disabled: this.isInfo }, [Validators.required]],
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
      name: this.form.controls.name.value,
      uri: this.form.controls.url.value,
      code: this.form.controls.code.value,
      status: this.form.controls.status.value,
    };
    if (data.name === null || data.name === undefined || data.name === '') {
      this.isLoading = false;
      this.messageService.error(`Tên tag không được để trống!`);
      return;
    }

    if (this.isAdd) {
      this.listTag.map((item) => {
        if (item.note === data.code) {
          this.isLoading = false;
          this.messageService.error(`Mã tag đã tồn tại!`);
          flag = true;
          return;
        }
      });
      if (flag) {
        this.isLoading = false;
        return;
      }
      const promise = this.tagService.create(data).subscribe(
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
      const promise = this.tagService.update(data).subscribe(
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
