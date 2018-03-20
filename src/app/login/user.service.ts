import { Inject, Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

const baseUrl = environment.baseUrls.base;

@Injectable()
export class UserService {

    // locals
    private access_token = '';

    constructor(
      @Inject(Http) private http: Http) {
        this.access_token = localStorage.getItem('access_token');
    }

    getMyself() {
        // new headers
        const headers = new Headers();

        // add auth - need to add interceptor
        headers.append('Authorization', 'Bearer ' + this.access_token);

        return this.http.get(baseUrl + 'api/User/Me', { headers: headers })
        .map(res => res.json())
        .map((res) => {
            if (res.success == true) {
                return res;
            }
        });
	}
}
