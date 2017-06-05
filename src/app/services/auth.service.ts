import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  public user: any;
  public authState: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    this.user = this.afAuth.auth.onAuthStateChanged(user => this.user = user);
    this.authState = this.afAuth.authState;
    this.afAuth.authState.subscribe((auth) => {
      if (auth === null) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  isLoggedIn() {
    return !!this.user;
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
