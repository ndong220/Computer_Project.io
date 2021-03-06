import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// layout
import { LayoutProComponent } from '@brand';
import { environment } from '@env/environment';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserLockComponent } from './passport/lock/lock.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

import { AgGridComponent } from './ag-grid/demo/ag-grid.component';
import { LayoutComponent } from './computer-customer/layout/layout.component';
import { NotFoundComponent } from './computer-customer/not-found/not-found.component';
import { JWTGuard } from '@delon/auth';
import { Exception404Component } from './exception/404.component';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [JWTGuard],
    component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ag-grid', component: AgGridComponent },
      // Exception
      {
        path: 'exception',
        loadChildren: () => import('./exception/exception.module').then((m) => m.ExceptionModule),
      },
      {
        path: 'res',
        loadChildren: () => import('./resource/resource.module').then((m) => m.ResourceModule),
      },
      {
        path: 'computer-management',
        loadChildren: () => import('./computer-management/computer-management.module').then((m) => m.ComputerManagementModule),
      },
    ],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: '',
        loadChildren: () => import('./computer-customer/computer-customer.module').then((m) => m.ComputerCustomerModule),
        data: { title: 'V??n Anh PC - Laptop Gaming, Pc Gaming' },
      },
    ],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '????ng nh???p', titleI18n: 'app.login.login' },
      },
      // {
      //   path: 'register',
      //   component: UserRegisterComponent,
      //   data: { title: '????ng k??', titleI18n: 'app.register.register' },
      // },
      // {
      //   path: 'register-result',
      //   component: UserRegisterResultComponent,
      //   data: { title: 'K???t qu??? ????ng k??', titleI18n: 'app.register.register' },
      // },
      // {
      //   path: 'lock',
      //   component: UserLockComponent,
      //   data: { title: 'M??n h??n kh??a', titleI18n: 'app.lock' },
      // },
    ],
  },
  // Single page not wrapped Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '404-not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '404-not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
