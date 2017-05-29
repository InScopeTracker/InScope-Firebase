import { Component, OnInit } from '@angular/core';
import { AngularFire, AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  authToken: any;
  public tasks: FirebaseListObservable<any>;
  state = '';
  public newTask: string;
  public currentProjectId: any;

  constructor(private firebaseService: FirebaseService, public app: AppComponent, public af: AngularFire, private db: AngularFireDatabase, private router: Router, private route: ActivatedRoute) {
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
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key);
  }

}
