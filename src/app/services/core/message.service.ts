import { Inject, Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { I18NService } from '../../core/i18n/i18n.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private injector: Injector, @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService) {}

  messages: string[] = [];

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  add(message: string): void {
    // console.log('add message');
    if (this.messages.length === 0) {
      this.showMessage();
    }
    this.messages.push(message);
    setTimeout(() => {
      this.clear();
    }, 10100);
  }

  clear(): void {
    this.messages = [];
  }

  showMessage(): void {
    // const mess = 'Chưa đăng nhập hoặc phiên đăng nhập hết hạn';
    // const context = 'Vui lòng đăng nhập để sử dụng dịch vụ.';
    // this.notification.error(`${this.i18n.fanyi('http.request.error')} Lỗi 123`, 'errortext', {
    //   nzPauseOnHover: true,
    // });

    // this.notification.success(`Thông báo`, `${this.error}`);
    //     this.messageService.success('Tải dữ liệu thành công');

    this.notification.error(
      `${this.i18n.fanyi('app.authen.message.error.title')}`,
      `${this.i18n.fanyi('app.authen.message.error.content')}`,
      {
        nzPauseOnHover: true,
        nzDuration: 10000,
      },
    );
  }
}
