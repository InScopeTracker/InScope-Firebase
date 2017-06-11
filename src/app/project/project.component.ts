import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {
  public user: FirebaseObjectObservable<any>;
  public tasks: FirebaseListObservable<any>;
  public currentProjectId: any;
  public currentProject: FirebaseObjectObservable<any>;
  public userPoints: any;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              private route: ActivatedRoute,
              private authService: AuthService,
              private db: AngularFireDatabase) { }

  ngOnInit() {
    this.user = this.firebaseService.getUser(this.authService.user.uid);
    this.currentProjectId = this.route.snapshot.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
    this.firebaseService.getProjectMembers();
    this.firebaseService.project = this.currentProject;
    this.firebaseService.tasks = this.tasks;
    this.getUserPoints();
  }

  getUserPoints() {
    this.currentProject.subscribe(project => {
      if (project.owner === this.authService.user.uid) {
        this.userPoints = this.db.object('/userProfiles/' +
        this.authService.user.uid +
        '/projectsOwned/' +
        this.currentProjectId);
      } else {
        this.userPoints = this.db.object('/userProfiles/' +
            this.authService.user.uid +
            '/projects/' +
            this.currentProjectId);
      }
    });
  }
}
