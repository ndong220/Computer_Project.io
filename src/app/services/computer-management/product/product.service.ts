import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { QueryFilerModel } from '@model';
import { productRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: _HttpClient) {}

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + productRouter.create, model);
  }

  createMany(model: any[]): Observable<any> {
    return this.http.post(environment.BASE_API_URL + productRouter.createMany, model);
  }

  update(model: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + productRouter.update, model);
  }

  getById(id: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + productRouter.getById + id);
  }
  getByCode(code: string): Observable<any> {
    const model = {
      code: code,
    };
    return this.http.post(environment.BASE_API_URL + productRouter.getByCode + environment.ALLOW_ANONYMOUS, model);
  }
  getListSimilar(code: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + productRouter.getListSimilar + environment.ALLOW_ANONYMOUS + '&code=' + code);
  }
  updateVisitCount(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + productRouter.updateVisitCount + environment.ALLOW_ANONYMOUS, model);
  }

  delete(list: [string]): Observable<any> {
    const option = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: list,
    };
    return this.http.request('delete', environment.BASE_API_URL + productRouter.delete, option);
  }

  getFilter(model: QueryFilerModel): Observable<any> {
    return this.http.post(environment.BASE_API_URL + productRouter.getFilter + environment.ALLOW_ANONYMOUS, model);
  }

  getListProductBySupplier(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + productRouter.getProdBySupplier + environment.ALLOW_ANONYMOUS, model);
  }

  getAll(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + productRouter.getAll + environment.ALLOW_ANONYMOUS);
  }

  getListCombobox(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + productRouter.getListCombobox);
  }
}
