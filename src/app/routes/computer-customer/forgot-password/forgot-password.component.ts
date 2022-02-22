import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less'],
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  constructor(private msg: NzMessageService, private cusService: CustomerService) {}
  isSuccess = false;
  ngOnInit(): void {}
  getPassword() {
    if (this.email === '') {
      this.msg.error('Hãy nhập email của bạn');
      return;
    }
    this.cusService.forgotPassword(this.email).subscribe(
      (res) => {
        if (res.code === 200) {
          this.isSuccess = true;
          this.msg.success('Lấy lại mật khẩu thành công.');
        } else {
          this.msg.error('Email bạn vừa nhập không có trong hệ thống. Vui lòng thử lại.');
        }
      },
      (err) => {
        this.msg.error('Email bạn vừa nhập không có trong hệ thống. Vui lòng thử lại.');
      },
    );
  }
}
