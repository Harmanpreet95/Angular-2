import { Component, OnInit } from '@angular/core';
import { Http, HttpModule, ConnectionBackend } from '@angular/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { LoginService } from './login.service';
import { UserService } from './user.service';
import { MerchantService } from '../shared/common/merchant.service';
import { NgForm } from '@angular/forms';
import { Global } from '../shared/models/global';
import { RootService } from '../shared/common/root.service';
import { MerchantLinkService } from '../shared/common/merchant-link.service';
import { ToasterService } from 'angular2-toaster';
import { User } from './user';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { CustomerService } from '../shared/common/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

      // set model for form
      model = new User('', '');
      submitted = false;
      productsSelected = true;
      isExprired = false;
      message = '';
      constructor(
          private _loginService: LoginService,
          private _customerService: CustomerService,
          private route: ActivatedRoute,
          private _router: Router,
          private _toaster: ToasterService,
          private _rootScope: RootService,
          private _merchantService: MerchantService,
          private _merchantLinkService: MerchantLinkService,
          private _userService: UserService
      ) {}

      private sub: any;
      private subMe: any;
      private localParams: any;

      ngOnInit() {
          // load products from url
          this.loadProducts();
          console.log(
              JSON.parse(localStorage.getItem('shopping')));
          // set merchant
          if (this.productsSelected === true) {
              this.checkMerchant();
          }
      }

      private checkMerchant() {
          // get merchant settings
          this._merchantService.GetMerchant(this.localParams.merchant).subscribe(res => {
              console.log(res);
              // check result
              if (res.result && res.result.useLinkExpiration === true) {

                  // check merchant link
                  this._merchantLinkService.GetMerchantLink(this.localParams.l).subscribe(link => {
                      this.isExprired = link.result.expired;
                  });
              }
          });
      }

      // whent he user submits the form
      onSubmit() {
          this.sub = this._loginService.login(this.model.email, this.model.password).subscribe((result) => {

              if (result.access_token) {
                this._toaster.pop('success', 'Success!', 'Logged In');

                // set access token
                this._rootScope.setAccess(result.access_token);

                // get me
                this.subMe = this._customerService.GetCustomerMe(result.access_token).subscribe((resMe) => {

                    // set up global
                    const global = new Global();

                    // set data
                    global.lastName = resMe.lastName;
                    global.firstName = resMe.firstName;
                    global.pictureUrl = resMe.pictureUrl;

                    // local
                    this._rootScope.setData(global);

                    // set logged In
                    this._rootScope.setLogged(true);

                    // move on to default page
                    this._router.navigate(['/dashboard']);
                });

              } else {
                  this._toaster.pop('error', 'Invalid login!', 'Invalid login');
                }
          }, err => {
              this._toaster.pop('error', 'Error!', 'Invalid login');
            });
      }

      ngOnDestroy() {
          if (this.sub != null) { this.sub.unsubscribe(); }
          if (this.subMe != null) { this.subMe.unsubscribe(); }
      }

      private loadProducts() {
          // force reset
          // localStorage.setItem('shopping', null);

          // clear out
          this._rootScope.clearAll();
          this._rootScope.setLogged(false);
          this._loginService.logout();

          // get all products from merchant
          this.route.queryParams.forEach((params: Params) => {

              // set local params
              this.localParams = params;

              // check for params
              if (this.localParams.productname != null) {

                  // set params
                  localStorage.setItem('shopping', JSON.stringify({
                      merchant: this.localParams.merchant,
                      uid: this.localParams.l,
                      productname: this.localParams.productname,
                      description: this.localParams.description,
                      image: this.localParams.image,
                      id: this.localParams.id,
                      price: this.localParams.price,
                      tax: this.localParams.tax,
                  }));
              } else {
                  this.productsSelected = false;
              }
          });
      }
  }
