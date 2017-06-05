import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isLoggedIn: Boolean;
  public currentProject: string;
  user: Observable<firebase.User>;
  authToken: any;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.authState;
    this.user.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
        this.isLoggedIn = true;
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => console.log('logged out'));
    // TODO: Redirect after logout is complete.
    this.isLoggedIn = false;
    this.router.navigateByUrl('/login');
  }
}
