import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less'],
})
export class NotFoundComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  gotoHomepage() {
    const app = JSON.parse(localStorage.getItem('app') || '{}');
    if (app !== null && app !== undefined && app !== {}) {
      switch (app.type) {
        case 'HOME':
          this.router.navigateByUrl('/home');
          break;
        case 'QTHT':
          this.router.navigateByUrl('/admin');
          break;
        default:
          break;
      }
    }
  }
}
