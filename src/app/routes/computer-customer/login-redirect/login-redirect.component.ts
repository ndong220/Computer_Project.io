import { state } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { reCaptchaKey } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';
declare var jQuery: any;
@Component({
  selector: 'app-login-redirect',
  templateUrl: './login-redirect.component.html',
  styleUrls: ['./login-redirect.component.less'],
})
export class LoginRedirectComponent implements OnInit {
  formLogin: FormGroup;
  passwordVisible = false;
  isLoading = false;
  isLogin = false;
  returnUrl = '';
  reCaptchaKey = reCaptchaKey;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private nzMessage: NzMessageService,
    private customerService: CustomerService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private router: Router,
  ) {
    this.route.queryParams.subscribe((res) => {
      this.returnUrl = res.returnUrl;
    });
    console.log(this.returnUrl);
    this.formLogin = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: ['', Validators.required],
      rememberMe: [true],
    });
  }
  submitForm(): void {
    this.isLoading = true;
    for (const i in this.formLogin.controls) {
      this.formLogin.controls[i].markAsDirty();
      this.formLogin.controls[i].updateValueAndValidity();
    }
    if (this.formLogin.errors) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    let loginModel = {
      username: this.formLogin.controls.username.value,
      password: this.formLogin.controls.password.value,
      rememberMe: this.formLogin.controls.rememberMe.value,
    };
    this.customerService.login(loginModel).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.code !== 200) {
          this.nzMessage.error('Đăng nhập thất bại');
          return;
        }
        if (res.data === null || res.data === undefined) {
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        if (res.data.userModel === null) {
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        const recaptchaValue = this.formLogin.controls.recaptcha.value;
        if (recaptchaValue === null || recaptchaValue === undefined || recaptchaValue === '') {
          this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
          return;
        }
        this.nzMessage.success('Đăng nhập thành công');
        this.customerService.changeLogin(true);
        this.isLogin = true;
        const model = {
          id: res.data.userId,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          avatarUrl: res.data.userModel.avatar,
          timeExpride: res.data.timeExpride,
          time: res.data.timeExpride,
          name: res.data.userModel.name,
          appId: res.data.applicationId,
          rights: res.data.listRight,
          roles: res.data.listRole,
          // isSysAdmin,
        };
        this.tokenService.set(model);
        if (res.data.userModel.isAdmin === true) {
          this.router.navigateByUrl('/admin');
        } else {
          window.location.href = this.returnUrl;
        }
      },
      (error) => {
        this.isLoading = false;
        this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
        this.router.navigateByUrl('/login');
      },
    );
  }
  ngOnInit(): void {}
}
