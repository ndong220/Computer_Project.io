import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { AgGridModule } from 'ag-grid-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ComputerManagementRoutingModule } from './computer-management-routing.module';
import { CategoryComponent } from './category/category/category.component';
import { CategoryItemComponent } from './category/category-item/category-item.component';
import { TagComponent } from './tag/tag/tag.component';
import { TagItemComponent } from './tag/tag-item/tag-item.component';
import { SupplierComponent } from './supplier/supplier/supplier.component';
import { SupplierItemComponent } from './supplier/supplier-item/supplier-item.component';
import { ProductComponent } from './product/product/product.component';
import { ProductItemComponent } from './product/product-item/product-item.component';
import { CategoryMetaComponent } from './category-meta/category-meta/category-meta.component';
import { CategoryMetaItemComponent } from './category-meta/category-meta-item/category-meta-item.component';
import { CartComponent } from './cart/cart/cart.component';
import { CartItemComponent } from './cart/cart-item/cart-item.component';
import { OrderComponent } from './order/order/order.component';
import { OrderItemComponent } from './order/order-item/order-item.component';
import { ProductReviewComponent } from './product-review/product-review/product-review.component';
import { ProductReviewItemComponent } from './product-review/product-review-item/product-review-item.component';
import { UserComponent } from './user/user/user.component';
import { UserItemComponent } from './user/user-item/user-item.component';
import { VoucherComponent } from './voucher/voucher/voucher.component';
import { VoucherItemComponent } from './voucher/voucher-item/voucher-item.component';

@NgModule({
  declarations: [
    CategoryComponent,
    CategoryItemComponent,
    TagComponent,
    TagItemComponent,
    SupplierComponent,
    SupplierItemComponent,
    ProductComponent,
    ProductItemComponent,
    CategoryMetaComponent,
    CategoryMetaItemComponent,
    CartComponent,
    CartItemComponent,
    OrderComponent,
    OrderItemComponent,
    ProductReviewComponent,
    ProductReviewItemComponent,
    UserComponent,
    UserItemComponent,
    VoucherComponent,
    VoucherItemComponent,
  ],
  imports: [CommonModule, CKEditorModule, ComputerManagementRoutingModule, SharedModule, AgGridModule.withComponents([])],
})
export class ComputerManagementModule {}
