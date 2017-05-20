import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {

  authToken: any;
  public tasks: FirebaseListObservable<any>;
  state = '';
  public newTask: string;
  public currentProject: string;

  constructor(public app: AppComponent, public af: AngularFire, private db: AngularFireDatabase, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
    this.tasks = this.af.database.list('/tasks');
    this.currentProject = app.currentProject;
  }

  verifyUserAndProject(email, project) {
    return email === this.authToken.auth.email && project === this.app.currentProject;
  }

  createTask() {
    const task = {
      task: this.newTask,
      owner: this.authToken.auth.email,
      project: this.app.currentProject,
      timestamp: Date.now()
    };
    const objRef = this.af.database.object(`/tasks/${this.newTask}`);
    objRef.set(task);
  }

  ngOnInit() {
  }

}
