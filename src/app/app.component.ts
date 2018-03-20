import { Component,  AfterViewInit, OnInit , OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { RootService } from './shared/common/root.service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  protected loggedIn = false;
  protected inContainer = true;

  sub: any;

  constructor(
      private _rootService: RootService,
      private route: ActivatedRoute,
      private router: Router
  ) {
      this.sub = this._rootService.loggedChange.subscribe((data) => {
          this.loggedIn = data;
      });
  }

  ngOnInit() {
      this.loggedIn = this._rootService.getLogged();

      this.router.events
          .filter(event => event instanceof NavigationEnd)
          .subscribe(event => {
              let currentRoute = this.route.root;
              while (currentRoute.children[0] !== undefined) {
                  currentRoute = currentRoute.children[0];
              }

          });

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
      this.loggedIn = false;
      if (this.sub != null) { this.sub.unsubscribe(); }
 }
}
