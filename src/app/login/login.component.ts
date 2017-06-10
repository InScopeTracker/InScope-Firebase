import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any; // TODO grab errors

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  loginGoogle() {
    this.authService.loginGoogle();
  }
}
