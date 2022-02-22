import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { ROLE_SYS_ADMIN } from '@util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserApiService } from 'src/app/services/api/user-api.service';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';

/**
 * Used when the app starts
 * Generally used to obtain the basic data required by the application, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    private userApiService: UserApiService,
    private msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  load(): Promise<void> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      zip(this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`), this.httpClient.get('assets/tmp/app-data.json'))
        .pipe(
          // Exception messages generated after receiving other interceptors
          catchError((res) => {
            console.warn(`StartupService.load: Network request failed`, res);
            resolve();
            return [];
          }),
        )
        .subscribe(
          ([langData, appData]) => {
            // setting language data
            this.translate.setTranslation(this.i18n.defaultLang, langData);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            // application data
            const res = appData as NzSafeAny;
            // Application information: including site name, description, year
            // this.settingService.setApp(res.app);
            // User information: including name, profile picture, email address
            this.settingService.setUser(res.user);

            // ACL：Set permissions to full
            // this.aclService.setFull(true);

            //#region Test ACL Service
            // this.aclService.add({ role: ['role1', 'role2'], ability: ['ability1', 'ability2'] });
            // console.log(this.aclService.data);
            // const s = this.aclService.change;
            // console.log(s);
            // this.aclService.add({ role: ['', 'role3', 'role4'], ability: ['ability3', 'ability4'] });
            // console.log(this.aclService.data);
            // console.log('role1: ' + this.aclService.can('role1'));
            // console.log('role1111: ' + this.aclService.can('role1111'));
            // this.aclService.attachRole(['ability4333']);
            // console.log(this.aclService.data);
            // this.aclService.setRole(['role11', 'role13', 'role14']);
            // console.log(this.aclService.data);
            // this.aclService.setAbility(['ability13', 'ability23', 'ability33']);
            // console.log(this.aclService.data);
            // console.log(this.aclService.can({ role: ['role1'] }));
            //#endregion
            const app = JSON.parse(localStorage.getItem('app') || '{}');
            if (app !== {} && app !== null && app !== undefined) {
              this.titleService.suffix = app.name;
            }
            // Initialization menu
            this.menuService.add(res.menu);
            // Set the suffix of the page title
            this.titleService.default = '';
          },
          () => {},
          () => {
            resolve();
          },
        );

      const token = this.tokenService.get();
      // console.log(this.aclService.data.roles);

      if (token?.rights && this.aclService.data.roles.length === 0) {
        const isSysAdmin = token.roles ? false : token.roles.includes(ROLE_SYS_ADMIN);
        this.aclService.add({ role: token.roles, ability: token.rights });

        zip(
          this.userApiService.getRightOfUser(this.tokenService?.get()?.id, this.tokenService?.get()?.appId),
          this.userApiService.getRoleOfUser(this.tokenService?.get()?.id, this.tokenService?.get()?.appId),
        )
          .pipe
          // Exception message after receiving other interceptors
          // catchError(([res]) => {
          //   resolve(null);
          //   return [langData];
          // }),
          ()
          .subscribe(
            ([res, role]) => {
              if (res.code !== 200) {
                this.msg.error(res.message);
              }
              if (role.code !== 200) {
                this.msg.error(role.message);
              }
              const listRole: any[] = [];
              const listRight: any[] = [];
              for (const iterator of res.data) {
                listRight.push(iterator.code);
              }
              for (const iterator of role.data) {
                listRole.push(iterator.code);
              }
              this.tokenService.set({
                ...token,
                rights: listRight,
                roles: listRole,
                isSysAdmin: listRole.includes(ROLE_SYS_ADMIN),
              });
              // console.log(this.aclService.data);
            },
            () => {},
            () => {
              resolve();
            },
          );
      }
    });
  }
}
