import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterState, RouterStateSnapshot } from '@angular/router';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { CategoryService, SupplierService } from '@service';
import { LIST_SORT_TYPE, PAGE_SIZE_OPTION_DEFAULT, QUERY_FILTER_DEFAULT } from '@util';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CartCustomerService } from 'src/app/services/computer-customer/cart-customer/cart-customer.service';
import { CategoryMetaService } from 'src/app/services/computer-management/category-meta/category-meta.service';
import { ProductService } from 'src/app/services/computer-management/product/product.service';

@Component({
  selector: 'app-search-by-code',
  templateUrl: './search-by-code.component.html',
  styleUrls: ['./search-by-code.component.less'],
})
export class SearchByCodeComponent implements OnInit {
  listSortType = LIST_SORT_TYPE;
  sortType = 0;
  priceMin = 0;
  priceMax = 0;
  type;
  code;
  pageSize = 20;
  pageSizeImg = 4;
  baseFile = environment.BASE_FILE_URL;
  pageIndex = 1;
  isVisible = false;
  range: any[] = [0, 0];
  max;
  maxDefault;
  min;
  snapshot: RouterStateSnapshot;
  totalCount = 0;
  listRange: any[] = [];
  listRangeChange: any[] = [0, 0];
  formatterDollar = (value: number) => `${value ? value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0}đ`;
  textSearch = '';
  filter: QueryFilerModel = { ...QUERY_FILTER_DEFAULT };
  listProd: any[] = [];
  myThumbnail: any;
  listPageSizeDf = PAGE_SIZE_OPTION_DEFAULT;
  form: FormGroup;
  itemQuickView: any;
  textFilter = '';
  listCateMeta: any[] = [];
  listSupplier: any[] = [];
  listCategory: any[] = [];
  nodes: any[] = [];
  constructor(
    private routes: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private cartCusService: CartCustomerService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private categoryMetaService: CategoryMetaService,
    private prodService: ProductService,
  ) {
    const state: RouterState = router.routerState;
    this.snapshot = state.snapshot;
    this.form = fb.group({
      sortType: [0],
      pageSize: [this.pageSize],
    });
  }
  filterBySupplier(id: any) {
    this.textFilter = id.name;
    this.filter.categoryId = null;
    this.filter.supplierId = id.id;
    this.fetchListProduct();
  }
  filterByCategory(id: any) {
    this.textFilter = id.name;
    this.filter.supplierId = null;
    this.filter.categoryId = id.id;
    this.fetchListProduct();
  }
  changePicture(item: any) {
    this.myThumbnail = this.baseFile + item;
  }
  fetchListProduct() {
    this.listProd = [];
    this.filter.pageNumber = this.pageIndex;
    this.filter.pageSize = this.pageSize;
    this.prodService.getFilter(this.filter).subscribe((res) => {
      if (res.code === 200) {
        this.listProd = res.data.data;
        this.maxDefault = res.data.maxDefault;
        this.totalCount = res.data.totalCount;
      }
    });
  }
  ngOnInit(): void {
    this.fetchListCategoryMetaByProd();
    this.routes.params.subscribe((res) => {
      this.type = res.type;
      this.code = res.code;
      this.textFilter = this.code;
      if (this.type === '1') {
        this.fetchListSupplier();
      } else {
        this.fetchListCategory();
      }
    });
  }
  fetchListSupplier() {
    this.supplierService.getListCombobox().subscribe((res) => {
      this.listSupplier = res.data;
      const supplier = this.listSupplier.filter(
        (x) => x.note.toString().toLowerCase().trim() === this.code.toString().toLowerCase().trim(),
      );
      if (supplier.length > 0) {
        this.filterBySupplier(supplier[0]);
        return;
      }
    });
  }
  fetchListCategory() {
    this.categoryService.getListCombobox().subscribe((res) => {
      this.listCategory = res.data;
      const category = this.listCategory.filter(
        (x) => x.note.toString().toLowerCase().trim() === this.code.toString().toLowerCase().trim(),
      );
      if (category.length > 0) {
        this.filterByCategory(category[0]);
        return;
      }
    });
  }
  changeIndex() {
    this.fetchListProduct();
  }
  changePageSize(event: any) {
    this.filter.pageSize = event;
    this.pageSize = event;

    this.fetchListProduct();
  }
  filterHandler(type: any = 1, event: any = 0) {
    this.filter.pageNumber = 1;
    this.pageIndex = 1;
    if (this.listRange === null || this.listRange === undefined || (this.listRange.length === 0 && type === 0)) {
      this.messageService.error('Hãy chọn khoảng giá');
      return;
    }
    if (type === 0) {
      this.filter.minPrice = this.listRangeChange[0];
      this.filter.maxPrice = this.listRangeChange[1];
      const sortType = this.form.controls.sortType.value;
      this.filter.sortType = sortType;
    }
    if (type === 1) {
      this.filter.sortType = event;
    }
    this.fetchListProduct();
  }
  addToCart(item: any) {
    this.cartCusService.addToCart(item, this.snapshot.url);
  }
  changeMax(event: any) {
    console.log(event);
    this.range[1] = event;
    console.log(this.range);
    this.cdRef.detectChanges();
  }
  changeMin(event: any) {
    this.range[0] = event;
  }
  changeRange(event: any) {
    this.listRangeChange = event;
    this.range = event;
    this.min = event[0];
    if (event[0] < 20000000) {
      this.max = event[1];
    } else {
      this.max = this.maxDefault;
    }
  }
  changeSlider(event: any) {
    this.listRangeChange = event;
  }
  viewDetail(code: any) {
    const url = '/product-detail/' + code;
    window.location.href = url;
    // this.router.navigate(['/product-detail/' + code]);
  }
  updateVisitCount(prodCode: any, item: any) {
    this.isVisible = true;
    this.itemQuickView = item;
    if (this.itemQuickView.discount === 0) {
      this.itemQuickView.isShow = false;
      this.itemQuickView.cssClass = 'text-price-discount';
    } else {
      this.itemQuickView.cssClass = 'text-price';
      this.itemQuickView.isShow = true;
    }
    this.myThumbnail = this.baseFile + item.pictures[0];
    this.itemQuickView.listCategoryMetaProducts.map((item: any) => {
      this.listCateMeta.map((cate) => {
        if (cate.id === item.categoryMetaId) {
          item.categoryMetaName = cate.key;
        }
      });
    });
    this.itemQuickView.listPicturesActive = this.getListProdActive(this.itemQuickView.pictures);
    this.itemQuickView.listPicturesRs = this.getListProdRs(this.itemQuickView.pictures);
    if (prodCode) {
      const model = {
        prodCode: prodCode,
      };
      this.prodService.updateVisitCount(model).subscribe((res) => {
        this.itemQuickView.visitCount = res.data;
      });
    }
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  fetchListCategoryMetaByProd() {
    this.categoryMetaService.getAll().subscribe((res) => {
      this.listCateMeta = res.data.data;
    });
  }
  getListProdActive(list: any[]) {
    return list.slice(0, this.pageSizeImg);
  }
  getListProdRs(list: any[]) {
    let listRs: any = [];
    for (let index = 2; index <= list.length; index++) {
      const model = list.slice((index - 1) * this.pageSizeImg, index * this.pageSizeImg);
      if (model.length !== 0) {
        listRs.push(model);
      }
    }
    return listRs;
  }
}
