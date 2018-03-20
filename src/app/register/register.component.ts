import { Component, OnDestroy, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { RegisterService } from '../register/register.service';
import { StateService } from '../shared/common/state.service';
import { AccountService } from '../shared/common/account.service';
import { Global } from '../shared/models/global';
import { environment } from '../../environments/environment';
import { RootService } from '../shared/common/root.service';
import { Customer } from './customer';
import { ToasterService } from 'angular2-toaster';
import { CustomerService } from '../shared/common/customer.service';
import * as moment from 'moment';

declare let dwolla: any;
declare let jQuery: any;

@Component({
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnDestroy, OnInit {

    // locals
    protected token: String = '';
    protected message = '';
    protected states: any = [];
    public step = 1;
    protected subToken: any;
    // public dateValid = false;
    protected isSubmitted = false;
    protected customer = new Customer();
    protected isAgree = false;
    private access_token = '';

    // observables
    private sub: any;
    private subRegister: any;
    private subStates: any;
    private subMe: any;

    constructor(
        private _loginService: LoginService,
        private _rootScope: RootService,
        private _customerService: CustomerService,
        private _stateService: StateService,
        private _toaster: ToasterService,
        private _accountService: AccountService,
        private _registerService: RegisterService,
        private _router: Router
    ) {}

    ngOnInit() {
        // log out
        this._loginService.logout();

        // get states
        this.loadStates();
    }

    onSubmit() {
        this.registerUser();
    }

    private registerUser() {
        // double check
        if (this.isSubmitted === true) { return; }

        this.sub = this._loginService.register(this.customer).subscribe((result) => {

            if (result.value.success === false) {
                this._toaster.pop('error', 'Error!', result.value.message);

                // unset submitted
                this.isSubmitted = false;
            } else {

                // set submitted
                this.isSubmitted = true;

                // give it half a second to login
                setTimeout(() => {
                    // log in
                    this.login((success) => {
                        this.registerCustomer();
                    });
                }, 2000);

            }
        });

    }

    // here we register with dwolla
    private registerCustomer() {

        // register dwolla account
        this.subRegister = this._registerService.RegisterWithHeaders(this.access_token).subscribe((resultIav: any) => {

            // check for errors
            if (resultIav.status === 200) {

                this.loadDashboard();

            } else {
                // show success
                this._toaster.pop('error', 'Error!', resultIav.errorMessage);
            }

        });

    }

    private loadStates() {
        this.subStates = this._stateService.GetStates().subscribe(res => {
            this.states = res.rows;
        });
    }

    login(callback) {
        this.sub = this._loginService.login(this.customer.emailAddress, this.customer.password).subscribe((result) => {

            if (result.access_token) {

                this._toaster.pop('success', 'Success!', 'Logged in');

                // set access token
                this._rootScope.setAccess(result.access_token);

                // set local access token
                this.access_token = result.access_token;

                // get me
                this.subMe = this._customerService.GetCustomerMe(result.access_token).subscribe((resMe) => {

                    // set up global
                    const global = new Global();

                    // set data
                    global.lastName = resMe.result.lastName;
                    global.firstName = resMe.result.firstName;
                    global.pictureUrl = resMe.result.pictureUrl;

                    // local
                    this._rootScope.setData(global);

                    // set logged In
                    this._rootScope.setLogged(true);

                    // return
                    callback(true);
                });
            } else {
                this._toaster.pop('error', 'Error!', 'Invalid login');

                // return
                callback(false);
            }
        }, err => {
            this._toaster.pop('error', 'Error!', 'Invalid login');

            // return
            callback(false);
        });

    }

    private loadToken() {
        this.subToken = this._accountService.GetInstantVerificationToken().subscribe(res => {
            if (res.success === true) {
                // set token
                this.token = res.result;

                // turn on dwolla
                this.step = 2;

                // startIAV
                this.startIAV();
            }
        });
    }

    startIAV = function() {
        dwolla.configure(environment.dwolla_environment);
        dwolla.config.dwollaUrl = environment.dwolla_url;
        dwolla.iav.start('iavContainer', this.token, function(err, res) {

            // reload accounts
            this._toaster.pop('success', 'Success!', 'Account Created');

            // hide registration
            jQuery('#divRegister').hide();

            // show next
            jQuery('#divNext').show();

        });
    };

    private beginRegistration() {
        // hide registration
        jQuery('#divRegister').hide();

        // show next
        jQuery('#divNext').show();
    }

    public loadDashboard() {
        // move on to default page
        this._router.navigate(['/dashboard']);
    }

    public dobChanged() {
        // this.dateValid = moment().diff(moment(this.customer.dob), 'years') >= 18;
    }

    ngOnDestroy() {
        if (this.sub != null) { this.sub.unsubscribe(); }
        if (this.subMe != null) { this.subMe.unsubscribe(); }
        if (this.subStates != null) { this.subStates.unsubscribe(); }
        if (this.subToken != null) { this.subToken.unsubscribe(); }
        if (this.subRegister != null) { this.subRegister.unsubscribe(); }
    }

}
