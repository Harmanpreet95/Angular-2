import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class MerchantService {

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

    GetMerchant(id) {
        // make request
        return this.http.get(this.baseUrl + 'Merchant/Settings/' + id, { headers: this.headers })
            .map(res => res.json())
            .map((res) => {
                if (res != null) {
                    return res;
                }
            });
    }
}
