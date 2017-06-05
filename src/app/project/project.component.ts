import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

  authToken: any;
  public tasks: FirebaseListObservable<any>;
  public currentProjectId: any;
  public currentProject: FirebaseObjectObservable<any>;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              public afAuth: AngularFireAuth,
              private route: ActivatedRoute) {
    this.afAuth.idToken.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
    this.firebaseService.project = this.currentProject;
    this.firebaseService.tasks = this.tasks;
  }

}
