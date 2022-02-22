import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { moneyRouter } from '@util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(private http: HttpClient) {}
  getRate(rate: any): Observable<any> {
    return this.http.get(
      'https://free.currconv.com/api/v7/convert?_allow_anonymous=true&q=' + rate + '&compact=ultra&apiKey=3479f9b5af3d82af0e54',
    );
  }
}
