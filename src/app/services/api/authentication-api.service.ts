import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { authenticationRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  constructor(private http: _HttpClient) {}

  login(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + authenticationRouter.getToken, model);
  }
}
