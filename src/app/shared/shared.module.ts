import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
import { AlainThemeModule } from '@delon/theme';
import { TranslateModule } from '@ngx-translate/core';

import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// #region third libs
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CountdownModule } from 'ngx-countdown';

const THIRDMODULES = [CountdownModule, DragDropModule];
// #endregion

// #region your componets & directives
import { PRO_SHARED_COMPONENTS } from '../layout/pro';
import { AddressComponent } from './components/address/address.component';
import { DelayDirective } from './components/delay/delay.directive';
import { EditorComponent } from './components/editor/editor.component';
import { FileManagerComponent } from './components/file-manager/file-manager.component';
import { ImgComponent } from './components/img/img.component';
import { ImgDirective } from './components/img/img.directive';
import { LangsComponent } from './components/langs/langs.component';
import { MasonryDirective } from './components/masonry/masonry.directive';
import { MouseFocusDirective } from './components/mouse-focus/mouse-focus.directive';
import { QUICK_CHAT_COMPONENTS } from './components/quick-chat';
import { ScrollbarDirective } from './components/scrollbar/scrollbar.directive';
import { StatusLabelComponent } from './components/status-label/status-label.component';

import { LoaderComponent } from './components/loader/loader.component';
import { MessagesComponent } from './components/messages/messages.component';

import { PaginationComponent } from './components/pagination/pagination.component';

import { FormatDatePipe, GenderPipe } from './pipes';

import { DeleteModalComponent } from './components/modal/delete-modal/delete-modal.component';

const COMPONENTS_ENTRY = [
  LangsComponent,
  ImgComponent,
  FileManagerComponent,
  StatusLabelComponent,
  AddressComponent,
  LoaderComponent,
  MessagesComponent,
  PaginationComponent,
  ...QUICK_CHAT_COMPONENTS,
];
const COMPONENTS = [
  EditorComponent,
  DeleteModalComponent,
  LockModalComponent,
  QtvModalComponent,
  PaymentTypeCellRenderComponent,
  ...COMPONENTS_ENTRY,
  ...PRO_SHARED_COMPONENTS,
];
const DIRECTIVES = [ImgDirective, DelayDirective, MasonryDirective, ScrollbarDirective, MouseFocusDirective];
const PIPES = [FormatDatePipe, GenderPipe];
// #endregion

import { AgGridModule } from 'ag-grid-angular';

import {
  BtnCellRenderComponent,
  StatusCellRenderComponent,
  PaymentTypeCellRenderComponent,
  StatusDeleteCellRenderComponent,
  StatusImportCellRenderComponent,
  StatusNameCellRenderComponent,
  IsQtvCellRenderComponent,
} from './ag-grid/index';
import { LockModalComponent } from './components/modal/lock-modal/lock-modal.component';
import { QtvModalComponent } from './components/modal/qtv-modal/qtv-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    AgGridModule.withComponents([
      StatusCellRenderComponent,
      StatusNameCellRenderComponent,
      PaymentTypeCellRenderComponent,
      StatusDeleteCellRenderComponent,
      StatusImportCellRenderComponent,
      BtnCellRenderComponent,
    ]),
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: COMPONENTS_ENTRY,
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
