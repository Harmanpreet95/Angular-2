import { Inject, Injectable, Component } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class RegisterService {

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

      RegisterWithHeaders(access_token) {
        // add auth

        let localHeaders: Headers = new Headers();
        
        localHeaders.append('Authorization', 'Bearer ' + access_token);
        localHeaders.append('Content-Type', 'application/json');

        // make request
          return this.http.post(this.baseUrl + 'Customer/Dwolla', null, { headers: localHeaders })
            //   .map(res => res.json())
              .map((res) => {
                return res;
              });
      }

      Register() {
          // make request
          return this.http.post(this.baseUrl + 'Customer/Dwolla', null, { headers: this.headers })
              .map(res => res.json())
              .map((res) => {
                return res;
              });
      }
  }
