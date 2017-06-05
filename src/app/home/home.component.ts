import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public projects: FirebaseListObservable<any>;
  public newProject: string;

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              public app: AppComponent,
              private router: Router) { }

  /**
   * Creates a new project and pushes it to the firebase
   * database.
   */
  createProject() {
    const project = {
      title: this.newProject,
      owner: this.authService.user.email,
      members: [this.authService.user.email],
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
