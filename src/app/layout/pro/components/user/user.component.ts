import { ChangeDetectionStrategy, EventEmitter, Component, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { UserApiService } from '@service';
import { cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NzNotificationService } from 'ng-zorro-antd/notification';
@Component({
  selector: 'layout-pro-user',
  templateUrl: 'user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetUserComponent implements OnInit {
  @Input() homePageCheck = false;
  @Output() logOut = new EventEmitter<any>();
  constructor(
    public settings: SettingsService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private notifiService: NzNotificationService,
    private userService: UserApiService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.form = fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }
  token: any;
  passwordVisible = false;
  password?: string;
  newPasswordVisible = false;
  newPassword?: string;
  confirmPasswordVisible = false;
  confirmPassword?: string;
  isVisible = false;
  user: any;
  form: FormGroup;
  resetData() {
    this.form.reset();
  }
  login() {
    this.router.navigateByUrl('/passport/login');
  }
  validToken() {
    this.token = this.tokenService.get()?.token;
  }
  ngOnInit(): void {
    this.validToken();
    let _token = localStorage.getItem('_token');
    if (_token) {
      this.user = JSON.parse(_token);
    }
    // mock
    const token = this.tokenService.get() || {
      token: 'nothing',
      name: 'Admin',
      avatar: './assets/logo-color.svg',
      email: 'cipchk@qq.com',
    };
    this.tokenService.set(token);
  }
  showModal(): void {
    this.resetData();
    this.isVisible = true;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  logout(): void {
    this.tokenService.clear();
    this.validToken();
    this.logOut.emit('logout');
    // this.router.navigateByUrl(this.tokenService.login_url!);
    this.router.navigateByUrl('/passport/login');
  }
  checkConfirmPassword() {
    if (
      String(this.form.controls.newPassword.value).toLowerCase().trim() !==
      String(this.form.controls.confirmPassword.value).toString().toLowerCase().trim()
    ) {
      this.form.controls.confirmPassword.setErrors({ invalidConfirmPw: true });
      return;
    }
  }
  save() {
    cleanForm(this.form);
    // tslint:disable-next-line:forin
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }
    if (this.form.invalid) {
      this.messageService.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    const changePwModel = {
      oldPassword: this.form.controls.oldPassword.value,
      newPassword: this.form.controls.newPassword.value,
      confirmPassword: this.form.controls.confirmPassword.value,
    };
    const userModel = this.tokenService.get();
    const UpdateUserModel = {
      userName: userModel?.userName,
      oldPassword: changePwModel.oldPassword,
      newPassword: changePwModel.newPassword,
    };
    this.userService.changePassword(UpdateUserModel).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.messageService.error(`Có lỗi xảy ra: ${res.message}`);
          return;
        }
        this.isVisible = false;
        this.resetData();
        this.messageService.success('Đổi mật khẩu thành công');
      },
      (err) => {
        console.log(err);
        this.messageService.error(`Có lỗi xảy ra: ${err.error.message}`);
      },
    );
  }
}
