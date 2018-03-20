import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const baseUrl = environment.baseUrls.base;
const baseApi = environment.baseUrls.api;

@Injectable()
export class LoginService {

  // local variables
  private loggedIn = false;

  constructor(
      @Inject(Http) private http: Http,
      private _router: Router
      ) {
        this.loggedIn = !!localStorage.getItem('access_token');
    }

    register(customer) {

      // new headers
      const headers = new Headers();

      return this.http
        .post(baseApi + 'account/register', customer, { headers })
        .map(res => res.json())
        .map((res) => {
            return res;
        });

  }

  login(email, password) {

    // new headers
    const headers = new Headers();

    // add form header
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
        baseUrl + 'api/account/login',
        {
          username: email,
          password: password
        },
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  logout() {
    // reset data
    localStorage.removeItem('access_token');
    localStorage.removeItem('userdata');
    localStorage.removeItem('userlogged');

    this.loggedIn = false;

    return true;
  }

  checkCredentials() {
    if (localStorage.getItem('access_token') === null) {
      this._router.navigate(['/login']);
    }
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
