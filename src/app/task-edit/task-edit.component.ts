import { Component, OnInit } from '@angular/core';
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
  public project: any;
  public task: any;
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
              public fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.firebaseService.project.subscribe(project => this.project = project);
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ''
    });
    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set form validation messages now

    if (this.route.snapshot.url[0].path === 'create') {
      this.firebaseService.task = null;
    } else {
      this.firebaseService.task = this.firebaseService.getTask(this.route.parent.snapshot.params['id']);
      this.firebaseService.task.subscribe(task => {
        this.form.setValue({
          name: task.title || '',
          description: '(this currently does nothing)'
        });
      });
    }
  }

  /**
   * Create or update a task based on the information provided from the form.
   */
  onSubmit(form) {
    const projectId = this.project.$key;
    if (this.firebaseService.task) {
      // Update the existing task.
      this.firebaseService.updateTask({title: form.get('name').value}).then(() => {
        this.router.navigateByUrl(`/project/${projectId}/task/list`);
      }).catch(e => {
        console.log('an error!', e);
      });
    } else {
      // Create a new task.
      this.firebaseService.saveTask({
        title: form.get('name').value,
        owner: this.firebaseService.authToken.auth.email,
        projectTitle: this.project.title,
        projectId: this.project.$key,
        timestamp: Date.now()
      }).then(() => {
        this.router.navigateByUrl(`/project/${projectId}/task/list`);
      }).catch(e => {
        console.log('an error!', e);
      });
    }
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
