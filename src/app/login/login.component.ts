import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any; // TODO grab errors

  constructor(public afAuth: AngularFireAuth,
              private router: Router,
              public authService: AuthService) { }

  ngOnInit() {
  }

  loginGoogle() {
    this.authService.loginGoogle();
  }
}
