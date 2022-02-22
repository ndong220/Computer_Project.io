import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { reCaptchaKey } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less'],
})
export class RegisterComponent implements OnInit {
  passwordVisible = false;
  checkPasswordVisible = false;
  constructor(private fb: FormBuilder, private nzMessage: NzMessageService, private cusService: CustomerService, private router: Router) {
    this.formRegister = fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      captcha: [null, [Validators.required]],
      agree: [false, [Validators.required]],
      dateOfBirth: [null, Validators.required],
      sex: [null, [Validators.required]],
      recaptcha: ['', Validators.required],
    });
  }
  reCaptchaKey = reCaptchaKey;
  formRegister: FormGroup;
  ngOnInit(): void {}
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.formRegister.controls.checkPassword.updateValueAndValidity());
  }
  submitForm(): void {
    for (const i in this.formRegister.controls) {
      this.formRegister.controls[i].markAsDirty();
      this.formRegister.controls[i].updateValueAndValidity();
    }
    if (this.formRegister.valid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    if (this.formRegister.controls.agree.value === false) {
      this.formRegister.controls.agree.setErrors(['required']);
      return;
    }
    if (!this.formRegister.controls.recaptcha.value) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    let model = {
      name: this.formRegister.controls.nickname.value,
      username: this.formRegister.controls.username.value,
      password: this.formRegister.controls.password.value,
      email: this.formRegister.controls.email.value,
      dateOfBirth: this.formRegister.controls.dateOfBirth.value,
      phone: this.formRegister.controls.phoneNumber.value,
      isLock: false,
      isAdmin: false,
      sex: this.formRegister.controls.sex.value,
    };
    this.cusService.register(model).subscribe(
      (res) => {
        if (res.code === 200) {
          this.nzMessage.success('Đăng kí thành công');
          this.router.navigateByUrl('/login');
        }
      },
      (err) => {
        this.nzMessage.error(err.error.message);
      },
    );
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.formRegister.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
