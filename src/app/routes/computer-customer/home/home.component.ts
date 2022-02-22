import { AfterViewChecked, AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { StartupService } from '@core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { GM_GEAR, LAPTOP_ID, PC_GM } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CustomerService } from 'src/app/services/computer-customer/customer/customer.service';
import { CartService } from 'src/app/services/computer-management/cart/cart.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
declare var window: any;
declare var FB: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];
  tittle = 'Trang chủ';
  pageSize = 6;
  isVisible = false;
  pageSizeHotDeal = 12;
  listProdHotDeal: any[] = [];
  pageNumberHotDeal = 1;
  listProduct: any[] = [];
  listProductActive: any[] = [];
  listProdResult: any[] = [];
  listCart: Array<any> = [];
  listAcerActive: any[] = [];
  listAcerResult: any[] = [];

  listAsusActive: any[] = [];
  listAsusResult: any[] = [];

  listMsiActive: any[] = [];
  listMsiResult: any[] = [];

  listPcActive: any[] = [];
  listPcResult: any[] = [];

  listMhActive: any[] = [];
  listMhResult: any[] = [];

  listLinhKienActive: any[] = [];
  listLinhKienResult: any[] = [];

  listBGActive: any[] = [];
  listBGResult: any[] = [];

  listGmActive: any[] = [];
  listGmResult: any[] = [];

  prodCountActive: any[] = [];
  prodCountResult: any[] = [];

  listLenovoActive: any[] = [];
  listLenovoResult: any[] = [];
  listDellActive: any[] = [];
  listDellResult: any[] = [];
  itemQuickView: any;
  listHpActive: any[] = [];
  listHpResult: any[] = [];
  snapshot: RouterStateSnapshot;
  myThumbnail: any;
  moduleName = 'Trang chủ';
  baseFile = environment.BASE_FILE_URL;
  array = [
    {
      img: '../../../../../assets/tmp/img/slider/1.jpg',
    },
    {
      img: '../../../../../assets/tmp/img/slider/2.jpg',
    },
    {
      img: '../../../../../assets/tmp/img/slider/3.jpg',
    },
  ];
  constructor(
    private productService: ProductService,
    private settingService: SettingsService,
    private router: Router,
    private msgService: NzMessageService,
    private customerService: CustomerService,
    private startupService: StartupService,
    private categoryMetaService: CategoryMetaService,
    private cartCusService: CartCustomerService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.caculateCountDown();
    const state: RouterState = router.routerState;
    this.snapshot = state.snapshot;
    const token = this.tokenService.get()?.token;
    if (token) {
    } else {
      this.router.navigateByUrl('/home');
      this.customerService.changeLogin(false);
    }
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  ngOnInit(): void {
    this.fetchListProduct();
    this.fetchListCategoryMetaByProd();
  }
  updateVisitCount(prodCode: any, item: any) {
    this.ngAfterViewInit();
    this.isVisible = true;
    this.itemQuickView = item;
    if (this.itemQuickView.discount === 0) {
      this.itemQuickView.isShow = false;
      this.itemQuickView.cssClass = 'text-price-discount';
    } else {
      this.itemQuickView.isShow = true;
      this.itemQuickView.cssClass = 'text-price';
    }
    this.myThumbnail = this.baseFile + item.pictures[0];
    console.log(this.myThumbnail);
    this.itemQuickView.listCategoryMetaProducts.map((item: any) => {
      this.listCateMeta.map((cate) => {
        if (cate.id === item.categoryMetaId) {
          item.categoryMetaName = cate.key;
        }
      });
    });
    this.itemQuickView.listPicturesActive = this.getListPicActive(this.itemQuickView.pictures);
    this.itemQuickView.listPicturesRs = this.getListPicRs(this.itemQuickView.pictures);
    if (prodCode) {
      const model = {
        prodCode: prodCode,
      };
      this.productService.updateVisitCount(model).subscribe((res) => {
        this.itemQuickView.visitCount = res.data;
      });
    }
  }
  caculateCountDown() {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var countDownDate = new Date(tomorrow).getTime();

    // Update the count down every 1 second
    var x = setInterval(() => {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      var x = document.getElementById('demo');
      // Display the result in the element with id="demo"
      if (x) {
        x.innerHTML = hours + ' giờ ' + minutes + ' phút ' + seconds + ' giây';
      }
      if (distance <= 0) {
        this.caculateCountDown();
      }
    }, 1000);
  }
  changePicture(item: any) {
    this.myThumbnail = this.baseFile + item;
    console.log(this.myThumbnail);
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item, this.snapshot.url);
  }
  listLaptopRs: any[] = [];
  listPcRs: any[] = [];
  listGmRs: any[] = [];
  listCateMeta: any[] = [];
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      console.log(res);
      this.listCateMeta = res.data.data;
    });
  }
  getVoucher() {
    const token = this.tokenService.get()?.token;
    if (token) {
      this.router.navigateByUrl('/voucher');
    } else {
      this.msgService.error('Bạn cần đăng nhập để xem mã giảm giá');
    }
  }
  searchSupplier(ts: any) {
    this.router.navigateByUrl('/brand/1/' + ts);
  }
  searchCategory(ts: any) {
    this.router.navigateByUrl('/brand/2/' + ts);
  }
  fetchListProduct() {
    this.listLaptopRs = [];
    this.productService.getAll().subscribe((res) => {
      this.listProduct = res.data.data;
      for (let index = 0; index < this.listProduct.length; index++) {
        this.listProduct[index].listCategory.map((item: any) => {
          this.listProduct[index].discountRs = (this.listProduct[index].discount / this.listProduct[index].price) * 100;
          if (item == LAPTOP_ID) {
            this.listLaptopRs.push(this.listProduct[index]);
          }

          if (item == GM_GEAR) {
            this.listGmRs.push(this.listProduct[index]);
          }

          if (item == PC_GM) {
            this.listPcRs.push(this.listProduct[index]);
          }
        });
      }
      this.listProdHotDeal = [...this.listProduct.sort((a, b) => (b.discountRs > a.discountRs ? 1 : -1))];
      this.listProdHotDeal = this.listProdHotDeal.filter((x) => x.discountRs !== 0);
      console.log(this.listProdHotDeal);
      this.prodCountActive = this.getListProdActive(this.listProduct.sort((a, b) => (b.visitCount > a.visitCount ? 1 : -1)));
      this.prodCountResult = this.getListProdRs(this.listProduct.sort((a, b) => (b.visitCount > a.visitCount ? 1 : -1)));

      this.listAcerActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));
      this.listAcerResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));

      this.listPcActive = this.getListProdActive(this.listPcRs);
      this.listPcResult = this.getListProdRs(this.listPcRs);

      this.listGmActive = this.getListProdActive(this.listGmRs);
      this.listGmResult = this.getListProdRs(this.listGmRs);

      this.listAcerActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));
      this.listAcerResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ACER'));

      this.listMhActive = this.getListProdActive(this.listProduct.filter((x) => x.categoryString.toString().includes('Màn hình')));
      this.listMhResult = this.getListProdRs(this.listProduct.filter((x) => x.categoryString.toString().includes('Màn hình')));

      this.listBGActive = this.getListProdActive(this.listProduct.filter((x) => x.categoryString.toString().includes('Bàn ghế gaming')));
      this.listBGResult = this.getListProdRs(this.listProduct.filter((x) => x.categoryString.toString().includes('Bàn ghế gaming')));

      this.listLinhKienActive = this.getListProdActive(this.listProduct.filter((x) => x.categoryString.toString().includes('Linh kiện')));
      this.listLinhKienResult = this.getListProdRs(this.listProduct.filter((x) => x.categoryString.toString().includes('Linh kiện')));

      this.listAsusActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'ASUS'));
      this.listAsusResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'ASUS'));

      this.listMsiActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'MSI'));
      this.listMsiResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'MSI'));

      this.listDellActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'DELL'));
      this.listDellResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'DELL'));

      this.listLenovoActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'LENOVO'));
      this.listLenovoResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'LENOVO'));

      this.listHpActive = this.getListProdActive(this.listLaptopRs.filter((x) => x.supplierName === 'HP'));
      this.listHpResult = this.getListProdRs(this.listLaptopRs.filter((x) => x.supplierName === 'HP'));
    });
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  getListProdActive(list: any[]) {
    return list.slice(0, this.pageSize);
  }
  getListProdRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * this.pageSize, index * this.pageSize);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
  getListPicActive(list: any[]) {
    return list.slice(0, 4);
  }
  getListPicRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * 4, index * 4);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  ngAfterViewInit() {
    (function (d, s, id, idBefore) {
      let js,
        fjs = d.getElementsByTagName(s)[3];
      // for (let index = 0; index < fjs.length; index++) {
      //   console.log(index + ' ' + fjs[index].outerHTML);
      // }
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.setAttribute('src', 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1');
      // js.src = '//connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v10.0&appId=253504385800401&autoLogAppEvents=1';
      // Notice the "!" at the end of line
      fjs.nodeName; // <- error!

      if (fjs === null) {
        alert('oops');
      } else {
        // since you've done the nullable check
        // TS won't complain from this point on
        fjs.parentNode?.insertBefore(js, fjs); // <- no error
      }
    })(document, 'script', 'facebook-js-sdk', 'facebook-jssdk');
  }
}
