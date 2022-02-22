import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap, throttleTime } from 'rxjs/operators';

import { BrandService } from '../../pro.service';

@Component({
  selector: 'layout-pro-header',
  templateUrl: './header.component.html',
  host: {
    '[class.ant-layout-header]': 'true',
    '[class.alain-pro__header-fixed]': 'pro.fixedHeader',
    '[class.alain-pro__header-hide]': 'hideHeader',
    '[style.padding.px]': '0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutProHeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  hideHeader = false;

  @HostBinding('style.width')
  get getHeadWidth(): string {
    const { isMobile, fixedHeader, menu, collapsed, width, widthInCollapsed } = this.pro;
    if (isMobile || !fixedHeader || menu === 'top') {
      return '100%';
    }
    return collapsed ? `calc(100% - ${widthInCollapsed}px)` : `calc(100% - ${width}px)`;
  }

  constructor(public pro: BrandService, @Inject(DOCUMENT) private doc: any, private cdr: ChangeDetectorRef) {}

  private handScroll(): void {
    if (!this.pro.autoHideHeader) {
      this.hideHeader = false;
      return;
    }
    setTimeout(() => {
      this.hideHeader = this.doc.body.scrollTop + this.doc.documentElement.scrollTop > this.pro.autoHideHeaderTop;
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.pro.notify.pipe(tap(() => this.cdr.markForCheck())),
      fromEvent(window, 'scroll', { passive: false }).pipe(throttleTime(50), distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.handScroll());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
