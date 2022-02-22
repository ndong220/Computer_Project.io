import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { SharedModule } from '@shared';
import { ComputerCustomerRoutingModule } from './computer-customer-routing.module';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { SliderComponent } from './slider/slider.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { SupportComponent } from './support/support.component';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HeaderCusComponent } from './header-cus/header-cus.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LoginRedirectComponent } from './login-redirect/login-redirect.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { QuickViewComponent } from './quick-view/quick-view.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { SearchDetailComponent } from './search-detail/search-detail.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { VoucherComponent } from './voucher/voucher.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { AboutUsComponent } from './about-us/about-us.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ContactComponent } from './contact/contact.component';
import { SearchByCodeComponent } from './search-by-code/search-by-code.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    SliderComponent,
    SupportComponent,
    SubscribeComponent,
    FooterComponent,
    LayoutComponent,
    ProductDetailComponent,
    NotFoundComponent,
    HeaderCusComponent,
    LoginComponent,
    RegisterComponent,
    LoginRedirectComponent,
    AccountDetailComponent,
    QuickViewComponent,
    CartDetailComponent,
    CheckOutComponent,
    ConfirmComponent,
    SearchDetailComponent,
    VoucherComponent,
    ForgotPasswordComponent,
    AboutUsComponent,
    ContactComponent,
    SearchByCodeComponent,
    ListSupplierComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    NzEmptyModule,
    NzPageHeaderModule,
    NzResultModule,
    NzStatisticModule,
    NzSliderModule,
    NgxPayPalModule,
    NzCommentModule,
    ReactiveFormsModule,
    NgxImageZoomModule,
    NgxCaptchaModule,
    SharedModule,
    ComputerCustomerRoutingModule,
  ],
  providers: [CurrencyPipe],
})
export class ComputerCustomerModule {}
