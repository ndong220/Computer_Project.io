import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { unitRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitApiService {
  constructor(private http: _HttpClient) {}

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + unitRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + unitRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + unitRouter.update, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + unitRouter.getById + id);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + unitRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + unitRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + unitRouter.getAll);
  }

  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + unitRouter.getListCombobox);
  }
}
