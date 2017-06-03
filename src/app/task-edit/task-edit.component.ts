import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  public project: any;
  public task: any;
  form: FormGroup;

  statuses: string[] = ['To-Do', 'Delegated', 'Doing'];

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
              public fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.firebaseService.project.subscribe(project => this.project = project);
    this.form = this.fb.group({
      name: ['', Validators.required],
      taskStatus: this.statuses[0],
      description: ''
    });
    // Get task and set appropriate properties if this is a task update.
    if (this.route.snapshot.url[0].path !== 'create') {
      this.firebaseService.task = this.firebaseService.getTask(this.route.parent.snapshot.params['id']);
      this.firebaseService.task.subscribe(task => {
        this.form.setValue({
          name: task.title || '',
          taskStatus: task.taskStatus || this.statuses[0],
          description: task.description || ''
        });
      });
    }
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set form validation messages now
  }

  ngOnDestroy() {
    this.firebaseService.task = undefined;
  }

  /**
   * Create or update a task based on the information provided from the form.
   */
  onSubmit(form) {
    if (this.firebaseService.task) {
      this.updateTask(form);
    } else {
      this.createTask(form);
    }
  }

  /**
   * Update an existing task.
   */
  updateTask(form) {
    const projectId = this.project.$key;
    this.firebaseService.updateTask({
      title: form.get('name').value,
      taskStatus: form.get('taskStatus').value,
      description: form.get('description').value
    }).then(() => {
      this.router.navigateByUrl(`/project/${projectId}/task/list`);
    }).catch(e => {
      console.log('an error!', e);
    });
  }

  /**
   * Create a new task.
   */
  createTask(form) {
    const projectId = this.project.$key;
    this.firebaseService.saveTask({
      title: form.get('name').value,
      owner: this.firebaseService.authToken.auth.email,
      projectTitle: this.project.title,
      projectId: this.project.$key,
      taskStatus: form.get('taskStatus').value,
      timestamp: Date.now()
    }).then(() => {
      this.router.navigateByUrl(`/project/${projectId}/task/list`);
    }).catch(e => {
      console.log('an error!', e);
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
