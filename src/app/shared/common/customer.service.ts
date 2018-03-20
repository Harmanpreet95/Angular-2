import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CustomerService {

    constructor(@Inject(Http) private http: Http) {
        // get access token
        this.access_token = localStorage.getItem('access_token');

        // add auth
        this.headers.append('Authorization', 'Bearer ' + this.access_token);
        this.headers.append('Content-Type', 'application/json');
        this.headersAuthOnly.append('Authorization', 'Bearer ' + this.access_token);
    }

      // locals
      private access_token = '';
      protected baseUrl = environment.baseUrls.api;
      protected headers: Headers = new Headers();
      protected headersAuthOnly: Headers = new Headers();

    GetCustomerMe(access_token) {

        const meHeaders: Headers = new Headers();

        // add auth - need to add interceptor
        meHeaders.append('Authorization', 'Bearer ' + access_token);
        meHeaders.append('Content-Type', 'application/json');

        this.headersAuthOnly.append('Authorization', 'Bearer ' + access_token);

        // make request
        return this.http.get(this.baseUrl + 'Customer/Me', { headers: meHeaders })
            .map(res => res.json())
            .map((res) => {
                if (res != null) {
                    return res;
                }
            });
    }

    UpdateCustomer(customer) {
        // make request
        return this.http.post(this.baseUrl + 'Customer/Me', customer, { headers: this.headers })
            .map(res => res.json())
            .map((res) => {
                if (res.success == true) {
                    return res;
                }
            });
    }

    ChangePassword(password) {
        // make request
        return this.http.post(this.baseUrl + 'Account/Password', password, { headers: this.headers })
            .map(res => res.json())
            .map((res) => {
                return res;
            });
    }
}
