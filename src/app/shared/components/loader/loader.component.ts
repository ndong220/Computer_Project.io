import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../services/core/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less'],
})
export class LoaderComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;

  isLoading: boolean | undefined;

  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe((v: any) => {
      // console.log(v);
      this.isLoading = v;
    });
  }

  ngOnInit() {}
}
