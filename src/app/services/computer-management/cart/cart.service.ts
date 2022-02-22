import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { cartRouter } from '@util';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: _HttpClient) {}
  private listCartSource = new BehaviorSubject([]);
  currentCart = this.listCartSource.asObservable();
  changeCart(listCart: any) {
    this.listCartSource.next(listCart);
  }
  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + cartRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + cartRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + cartRouter.update, model);
  }

  getById(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + cartRouter.getById + environment.ALLOW_ANONYMOUS);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + cartRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + cartRouter.getFilter, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + cartRouter.getAll);
  }

  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + cartRouter.getListCombobox);
  }
}
