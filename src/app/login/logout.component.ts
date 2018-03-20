import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ToasterService } from 'angular2-toaster';

@Component({
    template: ' '
})

export class LogoutComponent implements OnInit, AfterViewInit {
    constructor(
        private _loginService: LoginService,
        private _toaster: ToasterService,
        private _router: Router
    ) {}

    ngOnInit() {
        this._toaster.pop('success', 'Success!', 'Logged Out');
        this._loginService.logout();
    }

    ngAfterViewInit() {
        this._router.navigate(['/login']);
    }
}
