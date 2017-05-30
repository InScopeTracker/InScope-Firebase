import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authToken: any;
  public projects: FirebaseListObservable<any>;
  public newProject: string;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              public af: AngularFire,
              private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  /**
   * Creates a new project and pushes it to the firebase
   * database.
   */
  createProject() {
    const project = {
      title: this.newProject,
      owner: this.authToken.auth.email,
      pointInterval: 20,
      currentPoints: 0,
      currentLevel: 1,
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
