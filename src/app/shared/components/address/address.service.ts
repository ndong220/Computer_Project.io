import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ArrayService } from '@delon/util';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PCCode {
  code?: string;
  name?: string;
  value?: string;
  label?: string;
  isLeaf?: boolean;
  children?: PCCode[];
}

export type AddressType = 'pc' | 'pca';
const MAXLENGTH = 6;

@Injectable({ providedIn: 'root' })
export class AddressService {
  private _pcCode?: NzCascaderOption[];
  private _pcaCode?: NzCascaderOption[];

  /**
   * Provinces and cities" secondary linkage data, the data comes from [pc-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pc-code.json)
   */
  get pc(): Observable<NzCascaderOption[]> {
    return this._pcCode ? of(this._pcCode) : this.getPcCode();
  }

  /**
   * "Province, city, district and county" three-level linkage data, the data comes from [pc-code.json](https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca-code.json)
   */
  get pca(): Observable<NzCascaderOption[]> {
    return this._pcaCode ? of(this._pcaCode) : this.getPcaCode();
  }

  constructor(private http: _HttpClient, private arrSrv: ArrayService) {}

  /**
   * Always keep 6 digits, not enough to fill `0`
   */
  fixValue(val: string): string {
    return `${val}000000`.substr(0, MAXLENGTH);
  }

  toValueArr(val: string, type: AddressType): string[] {
    val = this.fixValue(val);
    const res: string[] = [];
    if (type === 'pc') {
      res.push(val.substr(0, 2), val);
    } else {
      for (let i = 0; i < MAXLENGTH; i += 2) {
        res.push(val.substr(0, i + 2));
      }
    }
    return res.map(this.fixValue);
  }

  private map = (res: PCCode[]): NzCascaderOption[] => {
    this.arrSrv.visitTree(res, (item: PCCode) => {
      item.value = this.fixValue(item.code!);
      item.label = item.name;
      if (!item.children) {
        item.isLeaf = true;
      }
    });
    return res;
    // tslint:disable-next-line: semicolon
  };

  private getPcCode(): Observable<NzCascaderOption[]> {
    return this.http.get('./assets/tmp/pc-code.json').pipe(map(this.map));
  }

  private getPcaCode(): Observable<NzCascaderOption[]> {
    return this.http.get('./assets/tmp/pca-code.json').pipe(map(this.map));
  }
}
