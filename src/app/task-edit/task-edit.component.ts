import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService }  from '../services/firebase.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  authToken: any;
  public tasks: FirebaseListObservable<any>;
  public newTask: string;
  public currentProjectId: any;

  constructor(
    private firebaseService: FirebaseService,
    public app: AppComponent,
    public af: AngularFire,
    private router: Router,
    private route: ActivatedRoute) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.parent.parent.snapshot.params['id'];
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

  createTask() {
    const task = {
      task: this.newTask,
      owner: this.authToken.auth.email,
      projectId: this.currentProjectId,
      timestamp: Date.now()
    };
    this.tasks.push(task).then(() => {
      this.router.navigateByUrl('/project/:' + this.currentProjectId + '/task/list');
    });
  }

}
