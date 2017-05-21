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
    this.currentProject = app.currentProject;
    this.tasks = this.af.database.list('/tasks', {
      query: {
        orderByChild: 'projectTitle',
        equalTo: this.currentProject,
      }      
    });
    this.tasks.subscribe(console.log);  //For testing and debugging only
  }

  verifyUserAndProject(email, project) {
    return email === this.authToken.auth.email && project === this.app.currentProject;
  }

  createTask() {
    const task = {
      task: this.newTask,
      owner: this.authToken.auth.email,
      projectTitle: this.app.currentProject,
      timestamp: Date.now()
    };
    this.tasks.push(task);
  }

  ngOnInit() {
  }

}
