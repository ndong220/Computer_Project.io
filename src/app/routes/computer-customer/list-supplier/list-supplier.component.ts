import { Component, OnInit } from '@angular/core';
import { SupplierService } from '@service';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.less'],
})
export class ListSupplierComponent implements OnInit {
  listSupplier: any[] = [];
  baseFile = environment.BASE_FILE_URL;
  constructor(private supplierService: SupplierService, private router: Router) {
    this.fetchListSupplier();
  }

  ngOnInit(): void {}
  filterBySupplier(code: any) {
    this.router.navigateByUrl('brand/1/' + code);
  }
  fetchListSupplier() {
    this.supplierService.getListCombobox().subscribe((res) => {
      this.listSupplier = res.data;
    });
  }
}
