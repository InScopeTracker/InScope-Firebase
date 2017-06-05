import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;
  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth,
              private router: Router,
              private firebaseService: FirebaseService) {
    this.user = this.afAuth.authState;
    this.user.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  ngOnInit() {
  }

  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((result) => {
      this.firebaseService.authToken = result.credential.accessToken;
      this.firebaseService.user = result.user;
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.error = err;
    });
  }
}
