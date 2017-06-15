import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { ModalComponent } from '../modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit, OnDestroy {
  public createdProject: any;
  @Input() projects: FirebaseListObservable<any>;
  public newProjectForm: FormGroup;
  private formSubscription: Subscription;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.'
    }
  };

  constructor(private authService: AuthService,
              private router: Router,
              private db: AngularFireDatabase,
              public fb: FormBuilder,
              public app: AppComponent) { }

  ngOnInit() {
    this.newProjectForm = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.formSubscription = this.newProjectForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set form validation messages now
  }

  // Unsubscribe when the view is destroyed
  ngOnDestroy() {
    this.formSubscription.unsubscribe();
  }

  /**
   * Creates a new project and pushes it to the firebase database.
   */
  createProject(form) {
    this.createdProject = undefined;
    const newProjectName = form.get('name').value;
    const userId = this.authService.user.uid;
    const userEmail = this.authService.user.email;
    const project = {
      title: form.get('name').value,
      owner: userId,
      ownerEmail: userEmail,
      members: {},
      pointInterval: 20,
      currentPoints: 0,
      currentLevel: 1,
      timestamp: Date.now(),
      statuses: ['To-Do', 'Delegated', 'Doing']
    };

    // Get keys for new project and projectId.
    const projKey = this.projects.push(project).key;

    // Write the new data simultaneously in the project list and the userProfiles list.
    let updates = {};
    updates['/projects/' + projKey] = project;
    updates['/userProfiles/' + this.authService.user.uid +
    '/projectsOwned/' + projKey + '/permissions'] = true;
    this.db.database.ref().update(updates);

    // Add project to userProfiles/projects list
    updates = {};
    updates['/projects/' + projKey + '/members/' + userId] = true;
    this.db.database.ref().update(updates);

    // Sets projectPoints to zero
    updates = {};
    updates['/userProfiles/' + this.authService.user.uid +
    '/projectsOwned/' + projKey + '/projectPoints'] = 0;
    this.db.database.ref().update(updates);
    this.createdProject = {
      $key: projKey,
      name: newProjectName
    };
    this.modal.show();
  }

  /**
   * Redirect to project settings.
   */
  navToSettings(project) {
    this.app.currentProject = project.$key;
    this.router.navigateByUrl('/project/' + project.$key + '/settings');
  }

  /**
   * Set or reset validation messages.
   */
  onValueChanged(data?: any) {
    if (!this.newProjectForm) {
      return;
    }
    const form = this.newProjectForm;
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
}
