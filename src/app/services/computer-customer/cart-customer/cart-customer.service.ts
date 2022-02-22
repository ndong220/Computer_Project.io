import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartService } from '../../computer-management/cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartCustomerService {
  constructor(
    private cartService: CartService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private cartcusService: CartService,
    private router: Router,
    private nzMessage: NzMessageService,
  ) {}
  removeItem(item: any, listCart: any[]) {
    const index = listCart.indexOf(item);
    listCart.splice(index, 1);
    // localStorage.setItem('list-cart', JSON.stringify(listCart));
    this.cartService.changeCart(listCart);
    const cartModel = {
      listProducts: JSON.stringify(listCart),
    };
    this.cartcusService.changeCart(listCart);
    this.cartService.update(cartModel).subscribe((res) => {
      if (res.code === 200) {
        this.nzMessage.success('Cập nhật giỏ hàng thành công');
      } else {
        this.nzMessage.success('Có lỗi xảy ra');
      }
    });
    return listCart;
  }
  change(event: any, prod: any, listCart: any[]) {
    let total = 0;
    listCart.map((item) => {
      if (item.id === prod.id) {
        item.count = event;
      }
    });
    listCart.map((item) => {
      item.subTotal = item.count * (item.price - item.discount);
      total = total + item.subTotal;
    });
    // localStorage.setItem('list-cart', JSON.stringify(listCart));
    this.cartcusService.changeCart(listCart);
    const cartModel = {
      listProducts: JSON.stringify(listCart),
    };
    this.cartService.update(cartModel).subscribe((res) => {
      if (res.code === 200) {
        this.nzMessage.success('Cập nhật giỏ hàng thành công');
      } else {
        this.nzMessage.success('Có lỗi xảy ra');
      }
    });
    const modelReturn = {
      total: total,
      listCart: listCart,
    };
    return modelReturn;
  }
  addToCart(item: any, url: any) {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.cartService.getById().subscribe((res) => {
        if (res.code === 200) {
          const listProducts = JSON.parse(res.data ? (res.data.listProducts ? res.data.listProducts : '[]') : '[]');
          if (listProducts) {
            const listCart = listProducts;
            if (listCart.length > 0) {
              let flag = 0;
              listCart.forEach((c: any) => {
                if (c.id === item.id) {
                  c.count++;
                  flag = 1;
                }
              });
              if (flag === 0) {
                item.count = 1;
                listCart.push(item);
              }
            } else {
              item.count = 1;
              listCart.push(item);
            }
            const cartModel = {
              listProducts: JSON.stringify(listCart),
            };
            this.cartService.update(cartModel).subscribe((res) => {
              if (res.code === 200) {
                this.nzMessage.success('Đã thêm vào giỏ hàng');
              } else {
                this.nzMessage.success('Có lỗi xảy ra');
              }
            });
            this.cartService.changeCart(listCart);
          }
        }
      });
    } else {
      this.nzMessage.error('Bạn phải đăng nhập để mua hàng');
      console.log(url);
      this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    }
  }
}
