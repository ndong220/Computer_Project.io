import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { environment } from '@env/environment';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';
import { formatDistance } from 'date-fns';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductReviewService } from 'src/app/services/computer-management/product-review/product-review.service';
import { ArrayService } from '@delon/util';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzI18nService } from 'ng-zorro-antd/i18n';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.less'],
})
export class ProductDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  likes = 0;
  dislikes = 0;
  time = formatDistance(new Date(), new Date());

  like(): void {
    this.likes = 1;
    this.dislikes = 0;
  }

  dislike(): void {
    this.likes = 0;
    this.dislikes = 1;
  }
  pageSizes = 10;
  pageIndex = 1;
  inputReview = '';
  snapshot: RouterStateSnapshot;
  userInfo: any = {};
  urlComment = '';
  myThumbnail: any;
  itemQuickView: any = {};
  tooltips = ['Cực tệ', 'Tệ', 'Trung bình', 'Tốt', 'Tuyệt vời'];
  value = 5;
  listProductSimilar: any[] = [];
  token: any;
  inputValue = '';
  public Editor = ClassicEditor;
  baseFile = environment.BASE_FILE_URL;

  constructor(
    private productService: ProductService,
    private arrayService: ArrayService,
    private route: ActivatedRoute,
    private nzI18n: NzI18nService,
    private prodReviewService: ProductReviewService,
    private nzMessage: NzMessageService,
    private cartCusService: CartCustomerService,
    private prodService: ProductService,
    private cdf: ChangeDetectorRef,
    private router: Router,
    private categoryMetaService: CategoryMetaService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    const state: RouterState = router.routerState;
    this.snapshot = state.snapshot;
    this.userInfo = JSON.parse(localStorage.getItem('user-info') || '{}');
    if (this.userInfo.avatar) {
      let urlCheck = this.userInfo.avatar.slice(0, 4);
      if (urlCheck === 'http') {
        this.userInfo.avatar = this.userInfo.avatar;
      } else {
        this.userInfo.avatar = environment.BASE_FILE_URL + this.userInfo.avatar;
      }
    }
    this.token = this.tokenService.get()?.token;
    this.fetchListCategoryMetaByProd();
    const code = this.route.snapshot.paramMap.get('code');
    this.urlComment = environment.FE_URL + '/product-detail/' + code;
    this.fetchProductByCode(code ? code : '');
    this.fetchListSimilar(code ? code : '');
  }
  listCateMeta: any[] = [];
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      this.listCateMeta = res.data.data;
    });
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  pageSize = 4;
  getListProdActive(list: any[]) {
    return list.slice(0, 6);
  }
  getListProdRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * 6, index * 6);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
  getListPicActive(list: any[]) {
    return list.slice(0, this.pageSize);
  }
  getListPicdRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * this.pageSize, index * this.pageSize);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
  fetchProductByCode(code: string) {
    if (code) {
      this.prodService.getByCode(code).subscribe(
        (res) => {
          this.itemQuickView = res.data;
          if (this.itemQuickView.discount === 0) {
            this.itemQuickView.isShow = false;
            this.itemQuickView.cssClass = 'text-price-discount';
          } else {
            this.itemQuickView.isShow = true;
            this.itemQuickView.cssClass = 'text-price';
          }
          this.fetchListProdReview();
          this.myThumbnail = this.baseFile + this.itemQuickView.pictures[0];
          this.itemQuickView.listPicturesActive = this.getListPicActive(this.itemQuickView.pictures);
          this.itemQuickView.listPicturesRs = this.getListPicdRs(this.itemQuickView.pictures);
          this.itemQuickView.listCategoryMetaProducts.map((item: any) => {
            this.listCateMeta.map((cate) => {
              if (cate.id === item.categoryMetaId) {
                item.categoryMetaName = cate.key;
              }
            });
          });
          this.cdf.detectChanges();
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
  listSimilarActive: any[] = [];
  listSimilarRs: any[] = [];
  fetchListSimilar(code: string) {
    if (code) {
      this.prodService.getListSimilar(code).subscribe(
        (res) => {
          if (res.code === 200) {
            this.listProductSimilar = res.data;
            res.data.map((item, index) => {
              if (item.id === this.itemQuickView.id) {
                res.data.splice(index, 1);
                return;
              }
            });
            let listSimilarRs: any[] = [];
            // this.listProductSimilar = this.listProductSimilar.filter((x) => x.supplierId === this.itemQuickView.supplierId);
            this.listProductSimilar.map((item) => {
              this.itemQuickView.listCategory.map((cate) => {
                let filter = item.listCategory.filter((x) => x === cate);
                if (filter.length > 0) {
                  listSimilarRs.push(item);
                  return;
                }
              });
            });
            this.listSimilarActive = this.getListProdActive(listSimilarRs);
            this.listSimilarRs = this.getListProdRs(listSimilarRs);
          }
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
  isVisible = false;
  itemSimilarView;
  updateVisitCount(prodCode: any, item: any) {
    this.ngAfterViewInit();
    this.isVisible = true;
    this.itemSimilarView = item;
    this.myThumbnail = this.baseFile + item.pictures[0];
    this.itemSimilarView.listCategoryMetaProducts.map((item: any) => {
      this.listCateMeta.map((cate) => {
        if (cate.id === item.categoryMetaId) {
          item.categoryMetaName = cate.key;
        }
      });
    });
    this.itemSimilarView.listPicturesActive = this.getListPicActive(this.itemSimilarView.pictures);
    this.itemSimilarView.listPicturesRs = this.getListPicdRs(this.itemSimilarView.pictures);
    if (prodCode) {
      const model = {
        prodCode: prodCode,
      };
      this.productService.updateVisitCount(model).subscribe((res) => {
        this.itemSimilarView.visitCount = res.data;
      });
    }
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  ngOnDestroy(): void {}
  changePicture(item: any) {
    this.myThumbnail = this.baseFile + item;
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item, this.snapshot.url);
  }
  createFbSdk() {
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
  ngOnInit(): void {
    this.createFbSdk();
  }
  listProdReview: any[] = [];
  listRs: any[] = [];
  fetchListProdReview(commentId = null) {
    this.listRs = [];
    this.prodReviewService.getById(this.itemQuickView.id).subscribe((res) => {
      if (res.code === 200) {
        const data = res.data;
        this.listProdReview = res.data;
        const arrayTreeResult = data.map((item: any, i: number, arr: any[]) => {
          item.isQtv = false;
          let urlCheck = item.avatarUrl.slice(0, 4);
          if (urlCheck === 'http') {
            item.avatar = item.avatarUrl;
          } else {
            item.avatarUrl = environment.BASE_FILE_URL + item.avatarUrl;
          }
          const checkIsLeft = arr.some((c) => c.parentId === item.id);
          if (item.userId === this.userInfo.id) {
            if (this.userInfo.isQtv === true) {
              item.isQtv = true;
            }
          }
          return {
            id: item.id,
            parent_id: item.parentId,
            userName: item.userName,
            code: item.code,
            avatarUrl: item.avatarUrl,
            checked: false,
            isQtv: item.isQtv,
            content: item.content,
            createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
            rating: item.rating,
            status: item.status,
            userId: item.userId,
            isLeaf: !checkIsLeft,
          };
        });
        const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
          cb: (item, parent, deep) => {
            if (commentId !== null) {
              if (item.id === commentId) {
                item.checked = true;
              }
            }
            if (deep === 1) {
              item.isRoot = true;
              this.listRs.push(item);
            } else {
              item.isRoot = false;
            }
          },
        });
      }
    });
  }

  submitComment(parentId = null, type: any) {
    const token = this.tokenService.get()?.token;
    if (token) {
      let model: any;
      switch (type) {
        case 1:
          if (this.inputReview === '' || this.inputReview === undefined || this.inputReview === null) {
            this.nzMessage.error('Bạn hãy nhập bình luận nhé <3');
            return;
          }
          model = {
            productId: this.itemQuickView.id,
            productName: this.itemQuickView.name,
            userId: this.userInfo.id,
            avatarUrl: this.userInfo.avatar,
            rating: this.value,
            isRating: true,
            status: true,
            content: this.inputReview,
          };
          break;
        case 2:
          if (this.inputValue === '' || this.inputValue === undefined || this.inputValue === null) {
            this.nzMessage.error('Bạn hãy nhập bình luận nhé <3');
            return;
          }
          model = {
            productId: this.itemQuickView.id,
            productName: this.itemQuickView.name,
            userId: this.userInfo.id,
            avatarUrl: this.userInfo.avatar,
            rating: this.value,
            isRating: false,
            status: true,
            content: this.inputValue,
          };
          break;
        default:
          break;
      }
      if (parentId !== null) {
        Object.assign(model, { parentId: parentId });
      }
      this.prodReviewService.create(model).subscribe(
        (res) => {
          if (res.code === 200) {
            this.nzMessage.success('Đánh giá thành công. Chúc bạn có một ngày vui vẻ ^^');
            this.fetchListProdReview();
            this.inputValue = '';
            this.inputReview = '';
          }
        },
        (err) => {
          this.nzMessage.error('Có lỗi xảy ra ' + err.error.message);
        },
      );
    } else {
      this.nzMessage.error('Bạn cần đăng nhập để đánh giá');
      return;
    }
  }
  openReply(id: any) {
    this.listRs = [];
    const arrayTreeResult = this.listProdReview.map((item: any, i: number, arr: any[]) => {
      const checkIsLeft = arr.some((c) => c.parentId === item.id);

      return {
        id: item.id,
        parent_id: item.parentId,
        userName: item.userName,
        code: item.code,
        avatarUrl: item.avatarUrl,
        checked: false,
        content: item.content,
        isQtv: item.isQtv,
        createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
        rating: item.rating,
        status: item.status,
        userId: item.userId,
        isLeaf: !checkIsLeft,
      };
    });
    const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
      cb: (item, parent, deep) => {
        if (id !== null) {
          if (item.id === id) {
            item.checked = true;
          }
        }
        if (deep === 1) {
          item.isRoot = true;
          this.listRs.push(item);
        } else {
          item.isRoot = false;
        }
      },
    });
  }

  handleClose(id: any) {
    this.listRs = [];
    const arrayTreeResult = this.listProdReview.map((item: any, i: number, arr: any[]) => {
      const checkIsLeft = arr.some((c) => c.parentId === item.id);
      return {
        id: item.id,
        parent_id: item.parentId,
        userName: item.userName,
        code: item.code,
        avatarUrl: item.avatarUrl,
        checked: false,
        content: item.content,
        isQtv: item.isQtv,
        createdDate: formatDistanceToNow(new Date(item.createdDate) as Date, { locale: this.nzI18n.getDateLocale() }),
        rating: item.rating,
        status: item.status,
        userId: item.userId,
        isLeaf: !checkIsLeft,
      };
    });
    const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
      cb: (item, parent, deep) => {
        if (id !== null) {
          if (item.id === id) {
            item.checked = false;
          }
        }
        if (deep === 1) {
          item.isRoot = true;
          this.listRs.push(item);
        } else {
          item.isRoot = false;
        }
      },
    });
  }
  ngAfterViewInit() {}
}
