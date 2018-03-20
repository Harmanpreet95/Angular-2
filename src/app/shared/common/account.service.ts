import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AccountService {

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

    GetInstantVerificationToken() {
        // manually set header
        const juddHeaders: Headers = new Headers();

        // add auth - need to add interceptor
        juddHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        juddHeaders.append('Content-Type', 'application/json');

        // make request
        return this.http.get(this.baseUrl + 'Linked/Token', { headers: juddHeaders   })
            .map(res => res.json())
            .map((res) => {
                if (res != null) {
                    return res;
                }
            });
    }

    GetAccounts() {
        // manually set header
        const juddHeaders: Headers = new Headers();

        // add auth - need to add interceptor
        juddHeaders.append('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        juddHeaders.append('Content-Type', 'application/json');

        // make request
        return this.http.get(this.baseUrl + 'LinkedAccount', { headers: juddHeaders })
            .map(res => res.json())
            .map((res) => {
                if (res.success === true) {
                    return res;
                }
            });
        }
}
