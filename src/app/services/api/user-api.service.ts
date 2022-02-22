import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { notifyRouter, userRouter } from '@util';
// RxJS
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  constructor(private http: _HttpClient) {}

  getRightOfUser(userId: string, applicationId: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + userRouter.getListRightOfUser + `/${userId}/right?applicationId=${applicationId}`);
  }

  getRoleOfUser(userId: string, applicationId: string): Observable<any> {
    return this.http.get(environment.BASE_API_URL + userRouter.getListRoleOfUser + `/${userId}/role?applicationId=${applicationId}`);
  }
  changePassword(userUpdatePasswordModel: any): Observable<any> {
    return this.http.put(environment.BASE_API_URL + userRouter.changePassword, userUpdatePasswordModel);
  }

  getNotify(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + notifyRouter.getAll + environment.ALLOW_ANONYMOUS);
  }
  updateNotify(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + notifyRouter.update, model);
  }

  create(model: any): Observable<any> {
    return this.http.post(environment.BASE_API_URL + userRouter.create, model);
  }
}
