import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QueryFilerModel } from '@model';
import { VoucherService } from '@service';
import { QUERY_FILTER_DEFAULT } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.less'],
})
export class VoucherComponent implements OnInit {
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  pageSize = 20;
  pageIndex = 1;
  userModel;
  totalCount = 0;
  listVoucherSelected: any = [];
  listVoucher: any[] = [];
  listVoucherByUser: any[] = [];
  constructor(
    private voucherService: VoucherService,
    private cusService: CustomerService,
    private cdf: ChangeDetectorRef,
    private msg: NzMessageService,
  ) {
    this.userModel = JSON.parse(localStorage.getItem('_token') || '{}');
  }

  ngOnInit(): void {
    if (this.userModel) {
      this.fetchListVoucherByUser();
    }
  }
  fetchListVoucherByUser() {
    this.cusService.getById(this.userModel.id).subscribe((res) => {
      if (res.code === 200) {
        this.listVoucherByUser = JSON.parse(res.data.voucherJson || '[]');
        this.fetchListVoucher();
      }
    });
  }
  changeIndex() {
    this.fetchListVoucher();
  }
  fetchListVoucher() {
    this.filter.type = true;
    this.voucherService.getFilter(this.filter).subscribe((res) => {
      if (res.code === 200) {
        const dataRs = res.data.data;
        this.listVoucher = dataRs;
        this.listVoucher.map((item) => {
          item.isSelected = 0;
          if (item.used >= item.quantity) {
            item.isSelected = 2;
          }
          this.listVoucherByUser.map((r) => {
            if (r.Id === item.id) {
              item.isSelected = 1;
            }
          });
          item.percent = (item.used / item.quantity) * 100;
          if (item.startTime && item.expiredTime) {
            item.timeValid =
              new Date(item.startTime).getDate() +
              '.' +
              (new Date(item.startTime).getMonth() + 1) +
              ' - ' +
              new Date(item.expiredTime).getDate() +
              '.' +
              (new Date(item.expiredTime).getMonth() + 1);
          }
          if (item.type === 1) {
            item.discountView = item.discount;
            item.typeName = '%';
          } else {
            item.discountView = item.discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            item.typeName = 'VNĐ';
          }
        });
        this.totalCount = res.data.totalCount;
      }
    });
  }
  getVoucher(item: any) {
    if (item.isSelected === true) {
      this.msg.error('Bạn đã chọn voucher này rồi');
    } else {
      this.listVoucherByUser.push(item);
      if (this.userModel) {
        const model = {
          id: this.userModel.id,
          vouchers: this.listVoucherByUser,
        };
        this.cusService.updateVoucher(model).subscribe((res) => {
          if (res.data) {
            this.msg.success('Lấy voucher thành công');
            const rs = res.data;
            rs.map((r: any) => {
              this.listVoucher.map((v) => {
                if (r.id === v.id) {
                  v.isSelected = 1;
                  v.used = r.used;
                }
              });
              if (r.status === false) {
                item.isSelected = 2;
              }
            });
            this.cdf.detectChanges();
          }
        });
      }
    }
  }
}
