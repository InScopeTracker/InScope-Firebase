import { Component, OnInit } from '@angular/core';
import {AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  public task: FirebaseObjectObservable<any>;
  form: FormGroup;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              public af: AngularFire,
              public fb: FormBuilder,
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
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ''
    });
    this.form.setValue({
      name: '',
      description: '(this currently does nothing)'
    });
    this.firebaseService.getTask(this.route.parent.snapshot.params['id']).subscribe(task => {
      this.task = task;

      // TODO: Setting values here is not working - we want to populate from with existing task
      this.form.setValue({
        name: task.name,
        description: ''
      });
    });
  }

  onSubmit(form) {
    // TODO: Update an existing task
    // For now, this only creates a new task.
    const task = {
      title: form.get('name').value,
      owner: this.authToken.auth.email,
      projectTitle: this.currentProject.title,
      projectId: this.currentProjectId,
      timestamp: Date.now()
    };
    this.tasks.push(task).then(() => {
      this.router.navigateByUrl('/project/' + this.currentProjectId + '/task/list');
    });
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
