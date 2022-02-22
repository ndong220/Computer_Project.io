import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, SupplierService } from '@service';
import { environment } from '@env/environment';
import { ArrayService } from '@delon/util';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  constructor(
    private router: Router,
    private categoryService: CategoryService,

    private arrayService: ArrayService,
  ) {
    this.fetchListCategory();
  }
  nodes: any[] = [];
  nodesNoChild: any[] = [];
  nodesChild: any[] = [];

  listCate: any[] = [];

  ngOnInit(): void {}
  search(ts: any) {
    this.router.navigateByUrl('/search-detail?textSearch=' + ts);
  }
  change(value: boolean): void {}
  viewProd(item: any) {
    this.router.navigateByUrl('brand/2/' + item.code);
  }

  fetchListCategory() {
    this.nodes = [];
    this.categoryService.getAll().subscribe((res) => {
      if (res.code === 200) {
        this.listCate = res.data.data;
        const arrayTreeResult = res.data.data.map((item: any, i: number, arr: any[]) => {
          const checkIsLeft = arr.some((c) => c.parentId === item.id);

          return {
            id: item.id,
            code: item.code,
            parent_id: item.parentId,
            title: item.name,
            isLeaf: !checkIsLeft,
          };
        });
        const l = this.arrayService.arrToTreeNode(arrayTreeResult, {
          cb: (item, parent, deep) => {
            if (deep !== 1) {
              arrayTreeResult.splice(arrayTreeResult.indexOf(item), 1);
            }
          },
        });
        this.nodes = arrayTreeResult;
      }
    });
  }
  gotoContact() {
    window.location.href = '/contact';
  }
}
