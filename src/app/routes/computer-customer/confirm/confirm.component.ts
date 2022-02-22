import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.less'],
})
export class ConfirmComponent implements OnInit {
  code = '';
  constructor(private route: ActivatedRoute) {
    const code = this.route.snapshot.paramMap.get('id');
    this.code = code ? code : '';
  }

  ngOnInit(): void {}
}
