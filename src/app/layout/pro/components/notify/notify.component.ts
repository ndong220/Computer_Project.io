import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { NoticeIconList, NoticeItem } from '@delon/abc/notice-icon';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parse from 'date-fns/parse';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as signalR from '@aspnet/signalr';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UserService } from 'src/app/services/computer-management/user/user.service';
import { UserApiService } from '@service';
import { Route, Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
@Component({
  selector: 'layout-pro-notify',
  templateUrl: './notify.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProWidgetNotifyComponent {
  data: NoticeItem[] = [
    {
      title: 'Chưa đọc',
      list: [],
      emptyText: 'Không có thông báo mới',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: 'Xem tất cả thông báo',
    },
    {
      title: 'Đã đọc',
      list: [],
      emptyText: 'Không có thông báo mới',
      emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: 'Xem tất cả thông báo',
    },
  ];

  count = 0;
  loading = false;
  listMsg: any[] = [];
  constructor(
    private msg: NzMessageService,
    private userService: UserApiService,
    private notifiService: NzNotificationService,
    private nzI18n: NzI18nService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cdr: ChangeDetectorRef,
  ) {
    const token = tokenService.get()?.token;
    if (token !== null && token !== '' && token !== undefined) {
      this.fetchListNotification();
    }

    let connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:8310/signalr')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err) => console.log('Error while establishing connection :('));

    connection.on('BroadcastMessage', (data: any) => {
      this.notifiService.info('Thông báo', 'Bạn có 1 thông báo mới');
      this.fetchListNotification();
      // if (data.listNotifications) {
      //   data.listNotifications.map((item: any) => {
      //     item.type = 'Thông báo';
      //     item.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png';
      //     item.datetime = item.createdDate.slice(0, 10);

      //     item.read = item.isRead;
      //   });
      //   this.listMsg = data.listNotifications;
      //   this.updateNoticeData(this.listMsg);
      //   this.count = this.listMsg.length;
      // }
      this.cdr.detectChanges();
    });
  }
  fetchListNotification() {
    this.userService.getNotify().subscribe((res) => {
      if (res.data) {
        res.data.map((item: any) => {
          item.datetime = new Date(item.createdDate);
          item.read = item.isRead;
          item.avatar =
            item.read === false
              ? 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
              : '../../../../../assets/img/open.png';
          item.type = item.read === false ? 'Chưa đọc' : 'Đã đọc';
        });
        this.listMsg = res.data;
        this.count = this.listMsg.filter((x) => x.read === false).length;
        this.cdr.detectChanges();
      }
    });
  }
  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach((i) => (i.list = []));

    notices.forEach((item) => {
      const newItem = { ...item };
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = parse(newItem.datetime, 'yyyy-MM-dd', new Date());
      }
      if (newItem.datetime) {
        newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      }
      if (newItem.extra && newItem.status) {
        newItem.color = ({
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        } as NzSafeAny)[newItem.status];
      }
      data.find((w) => w.title === newItem.type)?.list.push(newItem);
    });
    return data;
  }

  loadData(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    setTimeout(() => {
      this.data = this.updateNoticeData(this.listMsg);

      this.loading = false;

      this.cdr.detectChanges();
    }, 1000);
  }

  clear(type: string): void {
    this.msg.success(`清空了 ${type}`);
  }

  select(res: any): void {
    this.userService.updateNotify(res.item).subscribe();
    this.listMsg.map((item) => {
      if (item.id === res.item.id) {
        item.read = true;
        item.isRead = true;
        item.avatar =
          item.read === false
            ? 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
            : '../../../../../assets/img/open.png';
        item.type = 'Đã đọc';
      }
    });
    this.count = this.listMsg.filter((x) => x.read === false).length;
    this.updateNoticeData(this.listMsg);
    this.router.navigateByUrl('admin/computer-management/order');
  }
}
