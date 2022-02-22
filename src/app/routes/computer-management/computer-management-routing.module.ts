import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart/cart.component';
import { CategoryMetaComponent } from './category-meta/category-meta/category-meta.component';
import { CategoryComponent } from './category/category/category.component';
import { OrderComponent } from './order/order/order.component';
import { ProductReviewComponent } from './product-review/product-review/product-review.component';
import { ProductComponent } from './product/product/product.component';
import { SupplierComponent } from './supplier/supplier/supplier.component';
import { TagComponent } from './tag/tag/tag.component';
import { UserComponent } from './user/user/user.component';
import { VoucherComponent } from './voucher/voucher/voucher.component';

const routes: Routes = [
  {
    path: '',
    // component: LayoutProComponent,
    children: [
      { path: '', redirectTo: 'category', pathMatch: 'full' },
      { path: 'category', component: CategoryComponent },
      { path: 'tag', component: TagComponent },
      { path: 'supplier', component: SupplierComponent },
      { path: 'category-meta', component: CategoryMetaComponent },
      { path: 'product', component: ProductComponent },
      { path: 'order', component: OrderComponent },
      { path: 'user', component: UserComponent },
      { path: 'product-review', component: ProductReviewComponent },
      { path: 'voucher', component: VoucherComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComputerManagementRoutingModule {}
