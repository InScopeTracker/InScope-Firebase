import { Component } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: Boolean;
  public currentProject: string;
  authToken: any;

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
        this.isLoggedIn = true;
      }
    });
  }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
