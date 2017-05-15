import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './providers/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: Boolean;
  constructor(public authService: AuthService, private router: Router) {
    this.authService.af.auth.subscribe(
      (auth) => {
        if (auth == null) {
          console.log('Logged out');
          this.isLoggedIn = false;
          this.router.navigate(['login']);
        } else {
          this.isLoggedIn = true;
          this.authService.displayName = auth.google.displayName;
          this.authService.email = auth.google.email;
          console.log('Logged in');
          console.log(auth);
          this.router.navigate(['']);
        }
      }
    );
  }

  logout() {
    this.authService.logout();
  }
}
