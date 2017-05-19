import { Component, OnInit } from '@angular/core';
import {AngularFire, AuthProviders, AuthMethods, FirebaseListObservable} from 'angularfire2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authToken: any;
  public projects: FirebaseListObservable<any>;
  state = '';
  public newProject: string;

  constructor(public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
    this.projects = this.af.database.list('projects');
  }

  verifyUser(email) {
    return email === this.authToken.auth.email;
  }

  createProject(newProject) {
    const project = {
      project: newProject,
      owner: this.authToken.auth.email,
      timestamp: Date.now()
    };
  }

  ngOnInit() {
  }

}
