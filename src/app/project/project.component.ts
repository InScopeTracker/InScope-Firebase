import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from '../app.component';
import { FirebaseService }  from '../services/firebase.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})

export class ProjectComponent implements OnInit {

  authToken: any;
  public tasks: FirebaseListObservable<any>;
  state = '';
  public newTask: string;
  public currentProjectId: any;


  constructor(private firebaseService: FirebaseService, public app: AppComponent, public af: AngularFire, private router: Router, private route: ActivatedRoute) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  verifyUserAndProject(email, project) {
    return email === this.authToken.auth.email && project === this.app.currentProject;
  }

  createTask() {
    const task = {
      task: this.newTask,
      owner: this.authToken.auth.email,
      projectId: this.currentProjectId,
      timestamp: Date.now()
    };
    this.tasks.push(task);
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.params['id'];
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

}
