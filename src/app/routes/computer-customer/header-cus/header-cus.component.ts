import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { QUERY_FILTER_DEFAULT, reCaptchaKey } from '@util';
import { QueryFilerModel } from '@model';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { SocialAuthenticationApiService } from 'src/app/services/api/social-authentication-api.service';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
import { UserService } from 'src/app/services/computer-management/user/user.service';
import ts from 'typescript';
import { BaseService } from 'src/app/services/api';

@Component({
  selector: 'app-header-cus',
  templateUrl: './header-cus.component.html',
  styleUrls: ['./header-cus.component.less'],
})
export class HeaderCusComponent implements OnInit, OnDestroy {
  @ViewChild('search') search!: ElementRef;
  @ViewChild('searchResult') searchResult!: ElementRef;
  isVisible = false;
  reCaptchaKey = reCaptchaKey;
  isLoading = false;
  isLoadingFilter = false;
  passwordVisible = false;
  user: any;
  baseFile = environment.BASE_FILE_URL;
  userGoogle: any;
  avatar = '';
  listProd: any[] = [];
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  isChangeText = false;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  listCart: any[] = [];
  total: any = 0;

  textSearch = '';
  constructor(
    private authService: SocialAuthService,
    private cartService: CartService,
    private fb: FormBuilder,
    private socialAuthApiService: SocialAuthenticationApiService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private customerService: CustomerService,
    private productService: ProductService,

    private userService: UserService,
    private nzMessage: NzMessageService,
    private cartcustomerService: CartCustomerService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cusService: UserService,
  ) {
    this.listCart = [];
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (e.target !== this.searchResult.nativeElement) {
        this.isChangeText = false;
      }
    });
    const token = this.tokenService.get()?.token;
    if (token) {
      this.isLogin = true;
      this.getListCart();
      this.fetchUser();
    } else {
      this.isLogin = false;
    }
    this.sub1 = this.cartService.currentCart.subscribe((res) => {
      this.total = 0;
      this.listCart = res;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    });
    this.formLogin = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: [null, [Validators.required]],
      rememberMe: [true],
    });
    this.sub2 = this.userService.isChangeCurrent.subscribe((res) => {
      if (res === true) {
        this.fetchUser();
      }
    });

    this.sub3 = this.customerService.isLoginCurrent.subscribe((res) => {
      this.isLogin = res;
      if (this.isLogin === false) {
        this.listCart = [];
        this.total = 0;
      } else {
        this.total = 0;
        setTimeout(() => {
          this.fetchUser();
          this.getListCart();
        }, 3000);
      }
    });
  }
  fetchListProduct() {
    this.isLoadingFilter = true;
    this.listProd = [];
    this.filter.textSearch = this.textSearch;
    this.filter.pageNumber = 1;
    this.filter.pageSize = 999999;
    this.productService.getFilter(this.filter).subscribe((res) => {
      this.isLoadingFilter = false;
      if (res.code === 200) {
        this.listProd = res.data.data;
      }
    });
  }
  changeText() {
    this.isChangeText = true;
    this.fetchListProduct();
    if (this.textSearch === '' || this.textSearch === undefined || this.textSearch === null) {
      this.isChangeText = false;
    }
  }
  enterSearch() {
    this.router.navigateByUrl('search-detail?textSearch=' + this.textSearch);
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  ngOnDestroy(): void {
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    this.textSearch = '';
  }
  formLogin: FormGroup;
  isLogin: any = false;

  userName = '';

  ngOnInit(): void {
    this.cdRef.detectChanges();
  }
  showModal(): void {
    this.isVisible = true;
  }
  navigate(url: string) {
    window.location.href = url;
  }
  getListCart() {
    this.total = 0;
    this.cartService.getById().subscribe((res) => {
      if (res.code === 200) {
        const listProducts = JSON.parse(res.data.listProducts ? res.data.listProducts : null);
        if (listProducts) {
          const listCart = listProducts;
          if (listCart !== '' && listCart.length !== 0 && listCart !== undefined && listCart !== null) {
            this.listCart = listCart;
            this.listCart.map((item) => {
              item.subTotal = item.count * (item.price - item.discount);
              this.total = this.total + item.subTotal;
            });
          }
        }
      }
    });
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((res) => {
      console.log(res);
      this.userGoogle = res;
      if (this.userGoogle.email) {
        this.socialAuthApiService.authenicate(this.userGoogle).subscribe(
          (res: any) => {
            const username = res.data.username;
            const password = res.data.password;
            const provider = res.data.provider;
            this.signWithGoogle(username, password, provider);
          },
          (err: any) => {
            this.nzMessage.error('Có lỗi xảy ra ' + err.error.message);
          },
        );
      } else {
        this.nzMessage.error('Email không hợp lệ');
        return;
      }
    });
  }
  userFB;
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((res) => {
      this.userFB = res;
      if (this.userFB.email) {
        this.socialAuthApiService.authenicate(this.userFB).subscribe(
          (res: any) => {
            const username = res.data.username;
            const password = res.data.password;
            const provider = res.data.provider;
            this.signWithGoogle(username, password, provider);
          },
          (err: any) => {
            this.nzMessage.error('Có lỗi xảy ra ' + err.error.message);
          },
        );
      } else {
        this.nzMessage.error('Email không hợp lệ');
        return;
      }
    });
  }

  signOut(): void {
    this.authService.signOut();
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  fetchUser() {
    const userModel = JSON.parse(localStorage.getItem('_token') || '{}');
    if (userModel) {
      this.userService.getById(userModel.id).subscribe(
        (res) => {
          if (res.code === 200) {
            res.data.password = '';
            res.data.passwordSalt = '';
            localStorage.setItem('user-info', JSON.stringify(res.data));
            const data = res.data;
            this.user = res.data;
            this.userName = res.data.name;
            if (data.avatar) {
              let urlCheck = data.avatar.slice(0, 4);
              if (urlCheck === 'http') {
                this.avatar = data.avatar;
              } else {
                this.avatar = environment.BASE_FILE_URL + data.avatar;
              }
            }
          }
        },
        (err) => {},
      );
    }
  }
  submitForm(): void {
    this.isLoading = true;
    for (const i in this.formLogin.controls) {
      this.formLogin.controls[i].markAsDirty();
      this.formLogin.controls[i].updateValueAndValidity();
    }
    if (this.formLogin.errors) {
      this.isLoading = false;
      this.nzMessage.error('Kiểm tra thông tin các trường đã nhập');
      return;
    }
    const recaptchaValue = this.formLogin.controls.recaptcha.value;
    if (recaptchaValue === null || recaptchaValue === undefined || recaptchaValue === '') {
      this.isLoading = false;
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
          this.isLoading = false;
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        if (res.data.userModel === null) {
          this.isLoading = false;
          this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
          return;
        }
        if (res.data.userModel.isLock === true) {
          this.isLoading = false;
          this.nzMessage.error('Đăng nhập thất bại, tài khoản của bạn đã bị khóa');
          return;
        }
        this.nzMessage.success('Đăng nhập thành công');
        // this.customerService.changeLogin(true);
        // this.cusService.changeUser(true);
        this.isLogin = true;
        this.tokenService.set({
          id: res.data.userId,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          avatarUrl: res.data.userModel.avatarUrl,
          timeExpride: res.data.timeExpride,
          time: res.data.timeExpride,
          name: res.data.userModel.name,
          appId: res.data.applicationId,
          rights: res.data.listRight,
          roles: res.data.listRole,
          // isSysAdmin,
        });
        this.fetchUser();
        this.getListCart();
        this.isVisible = false;
        if (res.data.userModel.isAdmin === true) {
          this.router.navigateByUrl('/admin');
        } else {
          // this.router.navigateByUrl('/home');
        }
      },
      (error) => {
        this.isLoading = false;
        this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
        this.router.navigateByUrl('/home');
      },
    );
  }
  signWithGoogle(username: string, password: string, provider: string): void {
    this.isLoading = true;
    let loginModel = {
      username: username,
      password: password,
      provider: provider,
    };
    this.customerService.loginWithGoogle(loginModel).subscribe(
      (res) => {
        console.log(res);
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
        if (res.data.userModel.isLock === true) {
          this.nzMessage.error('Đăng nhập thất bại, tài khoản của bạn đã bị khóa');
          return;
        }
        this.nzMessage.success('Đăng nhập thành công');
        // this.customerService.changeLogin(true);
        // this.cusService.changeUser(true);
        this.isLogin = true;
        this.tokenService.set({
          id: res.data.userId,
          token: res.data.tokenString,
          email: res.data.userModel.email,
          avatarUrl: res.data.userModel.avatarUrl,
          timeExpride: res.data.timeExpride,
          time: res.data.timeExpride,
          name: res.data.userModel.name,
          appId: res.data.applicationId,
          rights: res.data.listRight,
          roles: res.data.listRole,
          // isSysAdmin,
        });
        this.fetchUser();
        this.getListCart();
        this.userFB = '';
        this.userGoogle = '';
        this.isVisible = false;
        if (res.data.userModel.isAdmin === true) {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/home');
        }
      },
      (error) => {
        this.isLoading = false;
        this.nzMessage.error('Đăng nhập thất bại, sai tên tài khoản hoặc mật khẩu');
        this.router.navigateByUrl('/home');
      },
    );
  }
  logout() {
    this.tokenService.clear();
    // this.signOut();
    this.customerService.changeLogin(false);
    this.router.navigateByUrl('/home');
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartcustomerService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
  removeItem(item: any) {
    this.listCart = this.cartcustomerService.removeItem(item, this.listCart);
  }
}
