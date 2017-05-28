import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from '../app.component';
import { FirebaseService }  from '../services/firebase.service';

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

  constructor(private firebaseService: FirebaseService, public app: AppComponent, public af: AngularFire, private db: AngularFireDatabase, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  /**
   * Verifies that the email passed in is the same as the currently
   * logged in user.
   * @param email
   * @returns {boolean}
   */
  verifyUser(email) {
    return email === this.authToken.auth.email;
  }

  /**
   * Creates a new project and pushes it to the firebase
   * database.
   */
  createProject() {
    const project = {
      title: this.newProject,
      owner: this.authToken.auth.email,
      timestamp: Date.now()
    };
    this.projects.push(project);
  }

  navToTasks(project) {
    this.app.currentProject = project.$key;
    this.router.navigateByUrl('/project/' + project.$key + '/task/list');
  }

  ngOnInit() {
    this.projects = this.firebaseService.getProjects();
  }

}
