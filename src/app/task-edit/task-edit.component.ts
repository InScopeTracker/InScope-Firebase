import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  authToken: any;
  public tasks: FirebaseListObservable<any>;
  public newTask: string;
  public currentProject: string;

  constructor(public app: AppComponent, public af: AngularFire, private router: Router) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
    this.tasks = this.af.database.list('/tasks', {
      query: {
        orderByChild: 'projectTitle',
        equalTo: this.currentProject,
      }
    });
  }

  ngOnInit() {
  }

  createTask() {
    const task = {
      task: this.newTask,
      owner: this.authToken.auth.email,
      projectTitle: this.app.currentProject,
      timestamp: Date.now()
    };
    this.tasks.push(task).then(() => {
      this.router.navigate(['project', this.app.currentProject, 'task', 'list']);
    });
  }

}
