import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { orderRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: _HttpClient) {}

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + orderRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + orderRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + orderRouter.update, model);
  }
  updateStatusOrder(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + orderRouter.updateStatusOrder, model);
  }
  getById(id: string, ts: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + orderRouter.getById + id + '&ts=' + ts);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + orderRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + orderRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + orderRouter.getAll);
  }

  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + orderRouter.getListCombobox);
  }
}
