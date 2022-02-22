import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RegisterComponent } from './register/register.component';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { VoucherComponent } from './voucher/voucher.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactComponent } from './contact/contact.component';
import { SearchByCodeComponent } from './search-by-code/search-by-code.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'register', component: RegisterComponent, data: { title: 'Đăng kí tài khoản' } },
      { path: 'login', component: LoginRedirectComponent, data: { title: 'Đăng nhập' } },
      { path: 'account-detail', component: AccountDetailComponent, data: { title: 'Chi tiết tài khoản' } },
      { path: 'checkout', component: CheckOutComponent, data: { title: 'Thanh toán' } },
      { path: 'cart-detail', component: CartDetailComponent, data: { title: 'Thông tin giỏ hàng' } },
      { path: 'search-detail', component: SearchDetailComponent, data: { title: 'Tìm kiếm sản phẩm' } },
      { path: 'brand/:type/:code', component: SearchByCodeComponent, data: { title: 'Tìm kiếm sản phẩm' } },
      { path: 'product-detail/:code', component: ProductDetailComponent, data: { title: 'Chi tiết sản phẩm' } },
      { path: 'confirm/:id', component: ConfirmComponent, data: { title: 'Đặt hàng thành công' } },
      { path: 'voucher', component: VoucherComponent, data: { title: 'Danh sách Voucher' } },
      { path: 'forgot-password', component: ForgotPasswordComponent, data: { title: 'Lấy lại mật khẩu' } },
      { path: 'about-us', component: AboutUsComponent, data: { title: 'Thông tin công ty' } },
      { path: 'contact', component: ContactComponent, data: { title: 'Thông tin liên hệ' } },
      { path: 'list-supplier', component: ListSupplierComponent, data: { title: 'Hãng sản xuất' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerCustomerRoutingModule {}
