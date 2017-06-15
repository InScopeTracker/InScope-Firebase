import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  // Login services provided in services/authService
  loginGoogle() {
    this.authService.loginGoogle();
  }
}
