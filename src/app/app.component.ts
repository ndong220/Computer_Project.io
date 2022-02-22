import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TitleService, VERSION as VERSION_ALAIN } from '@delon/theme';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VERSION as VERSION_ZORRO } from 'ng-zorro-antd/version';
import { filter } from 'rxjs/operators';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import 'ag-grid-enterprise';
import { HttpClient } from '@angular/common/http';
import { dashboardRouter } from '@util';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  template: `
    <app-loader></app-loader>
    <app-messages></app-messages>
    <div style="height: 100%;">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
    private http: HttpClient,
    private nzConfigService: NzConfigService,
  ) {
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
    renderer.setAttribute(el.nativeElement, 'github', 'https://github.com/minhvu1502');
    renderer.setAttribute(el.nativeElement, 'a' + 'u' + 't' + 'h' + 'o' + 'r', 'o' + 'r' + 'i' + 'o' + 'n' + '1' + '0' + '5' + '9' + '4');
  }
  msgs: any[] = [];
  ngOnInit(): void {
    var ob = this.http.get(environment.BASE_API_URL + dashboardRouter.update + environment.ALLOW_ANONYMOUS).subscribe((res) => {
      localStorage.setItem('visit-count', JSON.stringify(res));
    });
    this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleSrv.setTitle();
      this.modalSrv.closeAll();
    });
    this.nzConfigService.set('notification', { nzPlacement: 'topRight', nzPauseOnHover: true, nzDuration: 3000 });
    this.nzConfigService.set('message', { nzPauseOnHover: true, nzDuration: 3000, nzMaxStack: 5, nzTop: 24 });
  }
}
