import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
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
  public currentProjectId: string;
  public currentProject: any;
  public task: FirebaseObjectObservable<any>;
  form: FormGroup;

  formErrors = {
    'name': '',
    'power': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }
  };

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
    this.firebaseService.getTask(this.route.parent.snapshot.params['id']).subscribe(task => {
      this.task = task;
      this.form.setValue({
        name: task.title || '',
        description: '(this currently does nothing)'
      });
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set form validation messages now
  }

  /**
   * Create or update a task based on the information provided from the form.
   */
  onSubmit(form) {
    // TODO: Update doesn't work yet...
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

  /**
   * Set or reset validation messages.
   */
  onValueChanged(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
};
