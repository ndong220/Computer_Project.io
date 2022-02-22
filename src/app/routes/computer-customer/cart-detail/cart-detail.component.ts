import { Component, Inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { environment } from '@env/environment';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.less'],
})
export class CartDetailComponent implements OnInit {
  constructor(
    private cartService: CartService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cartcustomerService: CartCustomerService,
    private productService: ProductService,
  ) {}
  listCart: any[] = [];
  total = 0;
  radioValue: any = 1;
  shipping = 0;
  shippingValue = 25000;
  baseFile = environment.BASE_FILE_URL;
  ngOnInit(): void {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.getListCart();
    }
  }
  changeShipping(event: any) {
    switch (this.radioValue) {
      case 1:
        this.shipping = 0;
        break;
      case 2:
        this.shipping = this.shippingValue;
        break;
      default:
        break;
    }
  }
  getListCart() {
    this.cartService.getById().subscribe((res) => {
      if (res.code === 200) {
        const listProducts = JSON.parse(res.data.listProducts);
        if (listProducts) {
          const listCart = listProducts;
          if (listCart !== '' && listCart.length !== 0 && listCart !== undefined && listCart !== null) {
            if (listCart) {
              // listCart.map((item: any) => {
              //   item.categoryString = item.categoryName.toString();
              // });
            }
            this.listCart = listCart;
            // localStorage.setItem('list-cart', JSON.stringify(listCart));
            this.listCart.map((item) => {
              item.subTotal = item.count * (item.price - item.discount);
              this.total = this.total + item.subTotal;
            });
          }
        }
      }
    });
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  removeItem(item: any) {
    this.listCart = this.cartcustomerService.removeItem(item, this.listCart);
    if (this.listCart.length > 0) {
      this.total = 0;
      this.listCart.map((item) => {
        item.subTotal = item.count * (item.price - item.discount);
        this.total = this.total + item.subTotal;
      });
    } else {
      this.total = 0;
    }
  }
  changeCount(event: any, prod: any) {
    const rs = this.cartcustomerService.change(event, prod, this.listCart);
    console.log(rs);
    this.listCart = rs.listCart;
    this.total = rs.total;
  }
}
