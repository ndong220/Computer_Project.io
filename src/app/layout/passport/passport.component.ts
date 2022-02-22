import { Component } from '@angular/core';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  app: any;
  constructor(private settingService: SettingsService) {
    this.app = this.settingService.getData('app');
  }
  get year(): number {
    return new Date().getFullYear();
  }
  links = [];
}
