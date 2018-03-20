// modules
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// components
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './login/logout.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// directives
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MenuComponent } from './shared/menu/menu.component';

// services
import { ReserveService } from './shared/common/reserve.service';
import { MerchantService } from './shared/common/merchant.service';
import { MerchantLinkService } from './shared/common/merchant-link.service';
import { LoginService } from './login/login.service';
import { UserService } from './login/user.service';
import { AccountService } from './shared/common/account.service';
import { StateService } from './shared/common/state.service';
import { RegisterService } from './register/register.service';
import { AuthGuard } from './libs/auth-guard';
import { RootService } from './shared/common/root.service';
import { CustomerAddressService } from './shared/common/customer-address.service';
import { AppRoutingModule } from './app-routing.module';

import { ToasterModule, ToasterService } from 'angular2-toaster';
import { CustomerService } from './shared/common/customer.service';
import { CompleteComponent } from './complete/complete.component';

@NgModule({
  imports: [
    BrowserModule, BrowserAnimationsModule, FormsModule, HttpModule, AppRoutingModule, ToasterModule
  ],
  declarations: [
    AppComponent, LoginComponent, RegisterComponent, HeaderComponent, FooterComponent, LogoutComponent,
    DashboardComponent,  MenuComponent, CompleteComponent
  ],
  providers: [
    LoginService, RootService, UserService, AccountService, MerchantService, MerchantLinkService,
    CustomerAddressService, StateService, ReserveService, RegisterService, CustomerService,
    AuthGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [ AppComponent, [

  ] ]
})
export class AppModule {
}
