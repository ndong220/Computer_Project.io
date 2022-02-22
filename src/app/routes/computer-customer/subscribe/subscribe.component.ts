import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.less'],
})
export class SubscribeComponent implements OnInit {
  formSub: FormGroup;
  constructor(private nzMessage: NzMessageService, private fb: FormBuilder) {
    this.formSub = fb.group({
      email: [null, Validators.required],
    });
  }

  ngOnInit(): void {}
  Subscribe() {
    for (const i in this.formSub.controls) {
      this.formSub.controls[i].markAsDirty();
      this.formSub.controls[i].updateValueAndValidity();
    }
    const value = this.formSub.controls.email.value;
    if (value === '' || value === null || value === undefined) {
      this.nzMessage.error('Hãy nhập email hoặc số điện thoại của bạn.');
      return;
    }
    this.nzMessage.success('Bạn đã đăng kí thành công. Thông tin của bạn đã được ghi lại.');
    this.formSub.reset();
  }
}
