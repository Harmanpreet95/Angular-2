import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthGuard } from '../libs/auth-guard';
import { CustomerAddressService } from '../shared/common/customer-address.service';
import { AccountService } from '../shared/common/account.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReserveService } from '../shared/common/reserve.service';
import { StateService } from '../shared/common/state.service';
import { MerchantService } from '../shared/common/merchant.service';
import { Calculation } from '../libs/calculation';
import { Reserve, Product } from '../shared/models/reserve';
import { Address } from '../shared/models/address';
import { Account } from '../shared/models/account';
import { environment } from '../../environments/environment';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';

declare let jQuery: any;
declare let dwolla: any;
declare let amDone: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

    // local variables
    protected token: String = '';
    protected addresses: any = [];
    protected accounts: any = [];
    protected states: any = [];
    protected currentStep: Number = 1;
    protected selectedDuration: Number = 1;
    public isFinal: Boolean = false;
    public showDashboard: Boolean = true;
    protected useLockIn: Boolean = false;
    protected subMerchant: any;
    protected subReserve: any;
    private subAddresses: any;
    private subAccounts: any;
    private subStates: any;
    protected subToken: any;
    protected reserve: Reserve = new Reserve();
    protected address: Address = new Address();
    protected account: Account = new Account();
    private iavTimer;

    // constructor
    constructor(
        private _customerAddressService: CustomerAddressService,
        private _accountService: AccountService,
        private _reserveService: ReserveService,
        private _stateService: StateService,
        private _merchantService: MerchantService,
        private _toaster: ToasterService,
        private _router: Router
  ) {}

    // loads when page loads
    ngOnInit() {
        // set start date
        this.reserve.startDate = moment().format('Y-MM-DD');

        // load addresses
        this.loadAddresses();

        // get states
        this.loadStates();

        // load products
        this.loadProducts();

        // perform initlial calculation
        this.calculate();

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
        if (this.subAddresses != null) { this.subAddresses.unsubscribe(); }
        if (this.subAccounts != null) { this.subAccounts.unsubscribe(); }
        if (this.subStates != null) { this.subStates.unsubscribe(); }
        if (this.subStates != null) { this.subStates.unsubscribe(); }
        if (this.subToken != null) { this.subToken.unsubscribe(); }
    }

    // --------------------------------------------------------------------
    // navigation functions
    // --------------------------------------------------------------------

    protected moveNext() {

        this.reserve.Calculate();

        if (this.currentStep === 1) {
            if (this.reserve.reserveName === '') {
                this._toaster.pop('error', 'Invalid', 'Please enter a reserv name');
            } else {

                // save reserve
                this.saveReserve((res) => {
                    // add one to current step
                    this.currentStep = +this.currentStep + 1;
                })
            }
        } else if (this.currentStep === 2) {
            // save reserve
            this.saveReserve((res) => {
                // get accounts
                this.loadAccounts();

                // add one to current step
                this.currentStep = +this.currentStep + 1;
            })

        } else {
            // save reserve
            this.saveReserve((res) => {
                // add one to current step
                this.currentStep = +this.currentStep + 1;
            })
        }
    }

    protected movePrev() {
        this.currentStep = +this.currentStep - 1;
    }

    protected calculate() {

        // get deposit amount
        this.subMerchant = this._merchantService.GetMerchant(this.reserve.merchantUid).subscribe(res => {

            // check for lockin
            if(res.result.suppressLockOut) {
                if (res.result.suppressLockOut === true) {
                    this.useLockIn = false;
                } else {
                    this.useLockIn = true;
                }
            } else {
                this.useLockIn = true;
            }

            setTimeout(() => {
                // set deposit percentage
                this.reserve.depositPercentage = res.result.depositPercentage;

                // calculate
                this.reserve.Calculate();

            });
        });

    }

    protected complete() {

        // apply payments
        this.reserve.applyPayments = true;

        // save reserve
        this.saveReserve((res) => {

            // reset location
            localStorage.setItem('shopping', null);

            // move on to complete page
            this._router.navigate(['/complete']);

            this.isFinal = true;
        })

    }

    protected closeWindow() {
        try {
            window.close();
        } catch (error) {

        }
    }

    // --------------------------------------------------------------------
    // saving functions
    // --------------------------------------------------------------------

    private saveReserve(callback) {

        this.reserve.Calculate();

        // check for active reserve
        if (this.reserve.reserveId > 0) {

            // update reserve
            this.subReserve = this._reserveService.UpdateReserve(this.reserve.reserveId, this.reserve).subscribe(res => {
                callback();
            });

        } else {

            // add new serve
            this.subReserve = this._reserveService.AddReserve(this.reserve).subscribe(res => {

                // set reserve
                this.reserve.reserveId = res.result;
                callback();
            });

        }
    }

    // --------------------------------------------------------------------
    // loading functions
    // --------------------------------------------------------------------

    protected loadProducts() {

        // getting shopping cart
        const shoppingString = localStorage.getItem('shopping');

        // parse the shopping cart
        const shopping = JSON.parse(shoppingString);

        // load products
        this.getProducts(shopping);
    }

    private loadAddresses() {
        this.subAddresses = this._customerAddressService.GetCustomerAddress().subscribe(res => {
            this.addresses = res.rows;
            if (res.totalRowCount > 0) {
                this.reserve.addressId = this.addresses[0].addressId.toString();
            }
        });
    }

    private loadAccounts() {
        this.subAccounts = this._accountService.GetAccounts().subscribe(res => {
            this.accounts = res.rows;
            if (res.rows.length > 0) {
                this.reserve.accountUid = this.accounts[0].accountUid;
            }
        });
    }

    private loadStates() {
        this.subStates = this._stateService.GetStates().subscribe(res => {
            this.states = res.rows;
        });
    }

    protected addAddress() {

        let success = true;

        // check address
        if (this.address.address1 === '') {
            this._toaster.pop('error', 'Invalid Address 1', 'Please enter an address');
            success = false;
        }

        if (this.address.stateConst === '') {
            this._toaster.pop('error', 'Invalid State', 'Please select a state');
            success = false;
        }

        if (this.address.city === '') {
            this._toaster.pop('error', 'Invalid City', 'Please enter a city');
            success = false;
        }

        if (this.address.zipCode === '') {
            this._toaster.pop('error', 'Invalid Zip', 'Please enter zip code');
            success = false;
        }

        // check for success
        if (success === true) {

            this._customerAddressService.UpdateCustomer(this.address).subscribe(res => {
                // show address
                this._toaster.pop('success', 'Success!', 'Address Added');

                // reset address
                this.address = new Address();

                // reload addresses
                this.loadAddresses();
            });

        }
    }

    private getProducts(params) {

        // locals
        let index = 0;

        // init product
        this.reserve.products = new Array();

        // set merchant
        this.reserve.merchantUid = params.merchant;

        // get array of product names
        const productNames: string[] = params.productname.split('|');

        // loop through names
        productNames.forEach(productName => {

            // create new product
            const product = new Product();

            // grab other parameters
            const descriptions: string[] = params.description ? params.description.split('|') : [];
            const images: string[] = (params.image != null) ? params.image.split('|') : null;
            const ids: string[] = params.id ? params.id.split('|') : [];
            const prices: number[] = params.price ? params.price.split('|') : [];
            const taxes: number[] = params.tax ? params.tax.split('|') : [];
            // var shipping: number[] = params.shipping.split("|");

            // add properties
            product.productName = productName;
            product.description = descriptions[index];
            product.imageUrl = (images != null) ? images[index] : null;
            product.price = prices[index];
            product.tax = taxes[index];
            // product.shippingStandard = shipping[index];
            product.uniqueProductId = ids[index];

            // add to products
            this.reserve.products.push(product);

            // increment
            index++;
        });
    }

    protected addAccount() {
        this.subToken = this._accountService.GetInstantVerificationToken().subscribe((res) => {

            if (res.success === true) {
                // set token
                this.token = res.result;

                // hide dash
                this.showDashboard = false;

                // startIAV
                this.startIAV();
            }
        });
    }

    startIAV = function() {

        this.iavTimer = setInterval(() => {
            // check for done

            // if done, clear
            if (amDone) {

                // reload accounts
                this._toaster.pop('success', 'Success!', 'Account Added');

                // hide dash
                this.showDashboard = true;

                // set current step to show accounts
                this.currentStep = 3;

                // reload accounts
                this.loadAccounts();

                // stop timer
                clearInterval(this.iavTimer);

            }
            
        }, 1200);


        dwolla.configure(environment.dwolla_environment);
        dwolla.config.dwollaUrl = environment.dwolla_url;
        dwolla.iav.start('iavContainer', this.token, function(err, res) {

            amDone = 1;

        });
    };

}
