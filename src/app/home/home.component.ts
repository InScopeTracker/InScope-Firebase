import { Component, OnInit, OnDestroy } from '@angular/core';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { FilterPipe } from '../services/filter.pipe';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public projects: any;
  public user: FirebaseObjectObservable<any>;
  public newProject: string;
  private projectSubscription: Subscription;

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              public app: AppComponent,
              private router: Router,
              private db: AngularFireDatabase) { }

  /**
   * Creates a new project and pushes it to the firebase
   * database.
   */
  createProject() {
    if (this.newProject == null || this.newProject === undefined) {
      return;
    }
    const userId = this.authService.user.uid;
    const userEmail = this.authService.user.email;
    const project = {
      title: this.newProject,
      owner: userId,
      ownerEmail: userEmail,
      members: {},
      pointInterval: 20,
      currentPoints: 0,
      currentLevel: 1,
      timestamp: Date.now()
    };

    // Get keys for new project and projectId.
    const projKey = this.projects.push(project).key;

    // Write the new data simultaneously in the project list and the userProfiles list.
    let updates = {};
    updates['/projects/' + projKey] = project;
    updates['/userProfiles/' + this.authService.user.uid + '/projectsOwned/' + projKey] = true;

    this.db.database.ref().update(updates);

    updates = {};
    updates['/projects/' + projKey + '/members/' + userId] = true;
    this.db.database.ref().update(updates);
  }

  navToTasks(project) {
    this.app.currentProject = project.$key;
    this.router.navigateByUrl('/project/' + project.$key + '/task/list');
  }

  ngOnInit() {
    this.projects = this.firebaseService.getProjects();
    this.user = this.firebaseService.getUser(this.authService.user.uid);
  }
  
  ngOnDestroy() {
  }
}
