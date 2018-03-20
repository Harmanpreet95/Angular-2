import { Injectable, EventEmitter, Output, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Global } from '../../shared/models/global';

@Injectable()
export class RootService {
  data: any;
  logged: Boolean;

  dataChange: Observable<any>;
  loggedChange: Observable<any>;

  @Output() dataChangeObserver: any = new EventEmitter();
  @Output() loggedChangeObserver: any = new EventEmitter();

  constructor() {
    this.dataChange = new Observable(observer => {
      this.dataChangeObserver = observer;
    });

    this.loggedChange = new Observable(observer => {
      this.loggedChangeObserver = observer;
    });
  }

  reloadData() {
    if (localStorage.getItem('userdata')) {

      // get global data
      const gd = JSON.parse(localStorage.getItem('userdata'));

      // set up global
      const global = new Global();

      // set data
      global.lastName = gd.lastName;
      global.firstName = gd.firstName;
      global.pictureUrl = gd.pictureUrl;

      this.setData(gd);
    }

    if (localStorage.getItem('userlogged')) {
      this.setLogged(localStorage.getItem('userlogged') == '1' ? true : false);
    }
  }

  getData() {
    if (localStorage.getItem('userdata')) {
      const gd = JSON.parse(localStorage.getItem('userdata'));
      return gd;
    } else {
      return null;
    }
  }

  getLogged() {
    if (localStorage.getItem('userlogged')) {
      return localStorage.getItem('userlogged') == '1' ? true : false;
    } else {
      return false;
    }
  }

  clearAll() {
    localStorage.removeItem('userdata');
    localStorage.removeItem('userlogged');
  }

  setAccess(accessToken: any) {
    // set token
    localStorage.setItem('access_token', accessToken);
  }

  setData(data: any) {
    this.data = data;

    // set token
    localStorage.setItem('userdata', JSON.stringify(data));

    // fire change event
    this.dataChangeObserver.next(this.data);
  }

  setLogged(userlogged: Boolean) {
    this.logged = userlogged;

    // set token
    localStorage.setItem('userlogged', userlogged === true ? '1' : '0');

    // fire change event
    this.loggedChangeObserver.next(this.logged);
  }
}
