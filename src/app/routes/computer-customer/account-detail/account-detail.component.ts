import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { cleanForm } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductReviewService } from 'src/app/services/computer-management/product-review/product-review.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { OrderService } from 'src/app/services/computer-management/order/order.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.less'],
})
export class AccountDetailComponent implements OnInit {
  userInfo: any = {};
  checkIsRate = false;
  constructor(
    private routeActive: ActivatedRoute,
    private fb: FormBuilder,
    private nzMessage: NzMessageService,
    private cusService: UserService,
    private prodReviewService: ProductReviewService,
    private modal: NzModalService,
    private orderService: OrderService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    routeActive.queryParams.subscribe((res) => {
      this.index = res.type;
    });
    this.userInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
    this.formRegister = fb.group({
      username: [{ value: null, disabled: true }, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      nickname: [null, [Validators.required]],
      phoneNumberPrefix: ['+84'],
      phoneNumber: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      sex: [null, [Validators.required]],
    });
    this.formChangePassword = fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }
  tabs = ['Tất cả', 'Chờ xác nhận', 'Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'];
  avatar = '';
  totalCount = 0;
  pageIndex = 1;
  pageIndexRate = 1;
  pageIndexVoucher = 1;
  pageSize = 5;
  pageSizeRate = 3;
  pageSizeVoucher = 12;
  index = 0;
  viewDetail = false;
  avatarUrl: any = '';
  userId: any;
  tooltips = ['Cực tệ', 'Tệ', 'Trung bình', 'Tốt', 'Tuyệt vời'];
  ts = '';
  listVoucherByUser: any[] = [];
  passwordVisible = false;
  password?: string;
  baseFile = environment.BASE_FILE_URL;
  newPasswordVisible = false;
  newPassword?: string;
  listOrderAll: any[] = [];
  listOrder0: any[] = [];
  listOrder1: any[] = [];
  listOrder2: any[] = [];
  listOrder3: any[] = [];
  listOrder_1: any[] = [];
  confirmPasswordVisible = false;
  itemDetail = '';
  confirmPassword?: string;
  baseFileUrl = environment.BASE_FILE_URL;
  uploadUrl = environment.BASE_UPLOAD_URL;
  position: NzTabPosition = 'left';
  formRegister: FormGroup;
  formChangePassword: FormGroup;
  ngOnInit(): void {
    this.fetchUser();
    this.fetchOrderByUser();
  }
  changeTab() {
    this.pageIndex = 1;
  }
  buildAgain() {
    this.router.navigateByUrl('/search-detail?textSearch=');
  }
  viewDetailOrder(item: any) {
    this.viewDetail = true;
    this.itemDetail = item;
    console.log(this.itemDetail);
  }
  onBack() {
    this.viewDetail = false;
  }
  changeStatus(item: any) {
    this.modal.confirm({
      nzTitle: '<i>Bạn đã nhận được hàng?</i>',
      nzOnOk: () => {
        let data = {
          id: item.id,
          status: 3,
        };
        this.orderService.updateStatusOrder(data).subscribe(
          (res: any) => {
            if (res.code !== 200) {
              this.nzMessage.error(`${res.message}`);
              return;
            }
            if (res.data === null || res.data === undefined) {
              this.nzMessage.error(`${res.message}`);
              return;
            }
            const dataResult = res.data;
            this.nzMessage.success(`Cảm ơn bạn đã mua hàng. Hãy đánh giá sản phẩm thật tốt nhé ^^`);
            this.fetchOrderByUser();
          },
          (err: any) => {
            if (err.error) {
              this.nzMessage.error(`${err.error.message}`);
            } else {
              this.nzMessage.error(`${err.status}`);
            }
          },
        );
      },
    });
  }
  isVisible = false;

  itemRate;
  rate(item: any) {
    this.checkIsRate = false;
    this.isVisible = true;
    this.itemRate = item;
    let flag = 0;
    this.itemRate.listProducts.map((item) => {
      if (item.rate === 0 || item.rate === null) {
        flag++;
        return;
      }
    });
    if (flag === 0) {
      this.checkIsRate = true;
    } else {
      this.checkIsRate = false;
    }
  }
  submitRate() {
    let listReview: any[] = [];
    this.itemRate.listProducts.map((item) => {
      const model = {
        productId: item.id,
        productName: item.name,
        userId: this.userInfo.id,
        avatarUrl: this.userInfo.avatar,
        rating: item.rate,
        isRating: true,
        status: true,
        content: item.inputValue,
      };
      listReview.push(model);
    });
    this.prodReviewService.createMany(listReview).subscribe(
      (res) => {
        if (res.code === 200) {
          this.isVisible = false;
          this.nzMessage.success('Đánh giá thành công.');
          let data = {
            id: this.itemRate.id,
            status: 5,
          };
          this.orderService.updateStatusOrder(data).subscribe(
            (res: any) => {
              if (res.code === 200) {
                this.fetchOrderByUser();
              }
            },
            (err: any) => {
              if (err.error) {
                this.nzMessage.error(`${err.error.message}`);
              } else {
                this.nzMessage.error(`${err.status}`);
              }
            },
          );
        } else {
          this.nzMessage.success('Đánh giá thất bại.');
        }
      },
      (err) => {
        this.nzMessage.success('Đánh giá thất bại.');
      },
    );
  }
  checkValidRate(item: any, id: any) {
    this.itemRate.listProducts.map((item) => {
      if (item.id === id) {
        item.rate = item;
      }
    });
    const listRs = this.itemRate.listProducts.filter((x) => x.rate === null || x.rate === undefined);
    if (listRs.length > 0) {
      this.checkIsRate = true;
      return;
    }
    this.checkIsRate = false;
  }
  handleCancel(): void {
    this.itemRate.listProducts.map((item) => {
      item.rate = 0;
      item.inputValue = '';
    });
    this.isVisible = false;
  }
  cancelOrder(item: any) {
    this.modal.confirm({
      nzTitle: '<i>Bạn có chắc chắn muốn hủy đơn hàng không?</i>',
      nzOnOk: () => {
        let data = {
          id: item.id,
          status: -1,
        };
        this.orderService.updateStatusOrder(data).subscribe(
          (res: any) => {
            if (res.code !== 200) {
              this.nzMessage.error(`${res.message}`);
              return;
            }
            if (res.data === null || res.data === undefined) {
              this.nzMessage.error(`${res.message}`);
              return;
            }
            const dataResult = res.data;
            this.nzMessage.success(`Cập nhật đơn hàng thành công`);
            this.fetchOrderByUser();
          },
          (err: any) => {
            if (err.error) {
              this.nzMessage.error(`${err.error.message}`);
            } else {
              this.nzMessage.error(`${err.status}`);
            }
          },
        );
      },
    });
  }
  changeText(event: any) {
    this.fetchOrderByUser(event);
  }
  viewProdDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  fetchOrderByUser(event: string = '') {
    const userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    if (userModel) {
      this.orderService.getById(userModel.id, event).subscribe(
        (res) => {
          if (res.code === 200) {
            const data = res.data;
            data.map((item) => {
              item.listProducts = JSON.parse(item.listProducts);
              item.listProducts.map((prod) => {
                prod.categoryString = prod.categoryName.toString();
              });
            });
            this.listOrderAll = data;
            this.listOrder0 = data.filter((x) => x.status === 0);
            this.listOrder1 = data.filter((x) => x.status === 1);
            this.listOrder2 = data.filter((x) => x.status === 2);
            this.listOrder3 = data.filter((x) => x.status === 3 || x.status === 5);
            this.listOrder_1 = data.filter((x) => x.status === -1);
          }
        },
        (err) => {
          this.nzMessage.error(err.error.message);
        },
      );
    }
  }
  tabSelectChange(event: any) {
    this.index = event.index;
  }
  getVoucher(item: any) {
    if (item.isSelected !== 2) {
      this.router.navigateByUrl('/search-detail?textSearch=');
    }
  }
  fetchUser() {
    const userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    if (userModel) {
      this.cusService.getById(userModel.id).subscribe(
        (res) => {
          if (res.code === 200) {
            const data = res.data;
            this.listVoucherByUser = data.vouchers;
            if (this.listVoucherByUser) {
              this.totalCount = this.listVoucherByUser.length;
              this.listVoucherByUser.map((item) => {
                item.percent = (item.used / item.quantity) * 100;
                if (item.startTime && item.expiredTime) {
                  if (new Date(item.expiredTime) < new Date()) {
                    item.isSelected = 2;
                  }
                  item.timeValid =
                    new Date(item.startTime).getDate() +
                    '.' +
                    new Date(item.startTime).getMonth() +
                    ' - ' +
                    new Date(item.expiredTime).getDate() +
                    '.' +
                    new Date(item.expiredTime).getMonth();
                }
                if (item.type === 1) {
                  item.discountView = item.discount;
                  item.typeName = '%';
                } else {
                  item.discountView = item.discount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                  item.typeName = 'VNĐ';
                }
              });
            }
            this.userId = data.id;
            if (data.avatar) {
              let urlCheck = data.avatar.slice(0, 4);
              if (urlCheck === 'http') {
                this.avatar = data.avatar;
              } else {
                this.avatar = environment.BASE_FILE_URL + data.avatar;
              }
            }
            this.formRegister.controls.username.setValue(data.username);
            this.formRegister.controls.email.setValue(data.email);
            this.formRegister.controls.nickname.setValue(data.name);
            this.formRegister.controls.phoneNumber.setValue(data.phone);
            this.formRegister.controls.dateOfBirth.setValue(data.dateOfBirth);
            this.formRegister.controls.sex.setValue(data.sex);
          }
        },
        (err) => {
          this.nzMessage.error(err.error.message);
        },
      );
    }
  }
  checkConfirmPassword() {
    if (
      String(this.formChangePassword.controls.newPassword.value).toLowerCase().trim() !==
      String(this.formChangePassword.controls.confirmPassword.value).toString().toLowerCase().trim()
    ) {
      this.formChangePassword.controls.confirmPassword.setErrors({ invalidConfirmPw: true });
      return;
    }
  }
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.nzMessage.error('Bạn chỉ có thể tải lên tệp JPG, PNG!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.nzMessage.error('Kích thước tệp không vượt quá 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });
  };
  avatarDisplayUrl = '';
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      this.avatarUrl = info.file.name;
      this.avatarDisplayUrl = this.baseFileUrl + this.avatarUrl;
    }
    if (info.file.status === 'done') {
      this.nzMessage.success(`${info.file.name} tải Avatar thành công`);
    } else if (info.file.status === 'error') {
      this.nzMessage.error(`${info.file.name} tải thất bại.`);
    }
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.formRegister.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
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
    let model = {
      id: this.userId,
      dateOfBirth: this.formRegister.controls.dateOfBirth.value,
      name: this.formRegister.controls.nickname.value,
      email: this.formRegister.controls.email.value,
      phone: this.formRegister.controls.phoneNumber.value,
      sex: this.formRegister.controls.sex.value,
    };
    if (this.avatarUrl !== '') {
      Object.assign(model, { avatar: this.avatarUrl });
    }
    this.cusService.update(model).subscribe(
      (res) => {
        if (res.code === 200) {
          this.nzMessage.success('Cập nhật thành công');
          this.fetchUser();
          this.avatarUrl = '';
          this.cusService.changeUser(true);
        } else {
          this.nzMessage.error('Cập nhật thất bại');
        }
      },
      (err) => {
        this.nzMessage.error('Cập nhật thất bại');
        this.nzMessage.error(err.error.message);
      },
    );
  }
  resetData() {
    this.formChangePassword.reset();
  }
  save() {
    cleanForm(this.formChangePassword);
    // tslint:disable-next-line:forin
    for (const i in this.formChangePassword.controls) {
      this.formChangePassword.controls[i].markAsDirty();
      this.formChangePassword.controls[i].updateValueAndValidity();
    }
    if (this.formChangePassword.invalid) {
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    const changePwModel = {
      oldPassword: this.formChangePassword.controls.oldPassword.value,
      newPassword: this.formChangePassword.controls.newPassword.value,
      confirmPassword: this.formChangePassword.controls.confirmPassword.value,
    };
    const userModel = this.tokenService.get();
    const UpdateUserModel = {
      userName: userModel?.userName,
      oldPassword: changePwModel.oldPassword,
      newPassword: changePwModel.newPassword,
    };
    this.cusService.changePassword(UpdateUserModel).subscribe(
      (res) => {
        if (res.code !== 200) {
          this.nzMessage.error(`Có lỗi xảy ra: ${res.message}`);
          return;
        }
        this.resetData();
        this.nzMessage.success('Đổi mật khẩu thành công');
      },
      (err) => {
        console.log(err);
        this.nzMessage.error(`Có lỗi xảy ra: ${err.error.message}`);
      },
    );
  }
}
