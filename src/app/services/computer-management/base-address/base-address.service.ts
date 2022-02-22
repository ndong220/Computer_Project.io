import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { baseAddressRouter, categoryRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseAddressService {
  constructor(private http: _HttpClient) {}
  getCity(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + baseAddressRouter.city);
  }
  getDistrict(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + baseAddressRouter.district + id);
  }
  getCommune(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + baseAddressRouter.commune + id);
  }
}
