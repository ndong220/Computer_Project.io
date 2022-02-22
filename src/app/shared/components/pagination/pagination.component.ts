import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { QueryFilerModel } from '@model';
import { QUERY_FILTER_DEFAULT } from '@util';

@Component({
  selector: 'app-ag-grid-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less'],
})
export class PaginationComponent implements OnInit, OnChanges {
  constructor() {}
  paginationMessage = '';

  @Input() filter: QueryFilerModel = QUERY_FILTER_DEFAULT;
  @Input() pageSizeOptions: any[] = [];
  @Input() grid: any;

  @Output() pageNumberChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<string>();

  onPageNumberChange(): any {
    this.pageNumberChange.emit();
  }
  onPageSizeChange(): any {
    this.pageSizeChange.emit();
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    // console.log(this.filter);
    // console.log(this.grid);
    // console.log(this.pageSizeOptions);

    const i =
      (this.filter.pageSize === undefined ? 0 : this.filter.pageSize) *
      ((this.filter.pageNumber === undefined ? 0 : this.filter.pageNumber) - 1);

    this.paginationMessage = `Hiển thị <b>${i + 1} - ${i + this.grid?.totalData}</b> trên tổng số <b>${this.grid?.dataCount}</b> kết quả`;
  }
}
