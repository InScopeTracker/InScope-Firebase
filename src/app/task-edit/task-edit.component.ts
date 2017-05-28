import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
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
  public currentProjectId: string;
  public currentProject: any;

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
    this.firebaseService.getProject(this.currentProjectId).subscribe(project => {
        this.currentProject = project;
    });
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

  createTask() {
    const task = {
      title: this.newTask,
      owner: this.authToken.auth.email,
      projectTitle: this.currentProject.title,
      projectId: this.currentProjectId,
      timestamp: Date.now()
    };
    this.tasks.push(task).then(() => {
      this.router.navigateByUrl('/project/' + this.currentProjectId + '/task/list');
    });
  }
}
