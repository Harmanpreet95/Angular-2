import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReserveService {

    constructor(@Inject(Http) private http: Http) {
        // get access token
        this.access_token = localStorage.getItem('access_token');

        // add auth
        this.headers.append('Authorization', 'Bearer ' + this.access_token);
        this.headers.append('Content-Type', 'application/json');
    }

      // locals
      private access_token = '';
      protected baseUrl = environment.baseUrls.api;
      protected headers: Headers = new Headers();

      AddReserve(reserve) {
        // make request
        return this.http.post(this.baseUrl + 'Reserve', reserve,  { headers: this.headers })
            .map(res => res.json())
            .map((res) => {
                if (res != null) {
                    return res;
                }
            });
    }

    UpdateReserve(id, reserve) {
        // make request
        return this.http.put(this.baseUrl + 'Reserve/'+id, reserve,  { headers: this.headers })
            .map(res => res.json())
            .map((res) => {
                if (res != null) {
                    return res;
                }
            });
    }

}
