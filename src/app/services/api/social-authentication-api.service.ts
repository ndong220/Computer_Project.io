import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { socialAuthenticationRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialAuthenticationApiService {
  constructor(private http: _HttpClient) {}

  authenicate(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + socialAuthenticationRouter.authenticate, model);
  }
}
