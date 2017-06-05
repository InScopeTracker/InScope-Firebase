import { Component, OnInit } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit {

  public currentProjectId: any;
  public currentProject: FirebaseObjectObservable<any>;
  public updatedProjectInterval: number;
  public updatedCurrentPoints: number;
  public updatedLevel: number;
  public newMember: string;
  authToken: any;
  private projMembers$: Observable<any[]>;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private routes: Router,
              private route: ActivatedRoute) {
    this.afAuth.idToken.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
    this.projMembers$ = this.db.list('/projects/' + this.currentProjectId + '/members');
  }

  deleteProject() {
    this.firebaseService.deleteProject(this.currentProjectId);
    this.routes.navigateByUrl('/home');
  }

  updateProjectInterval() {
    if (!this.inputIsValid(this.updatedProjectInterval)) {
      return;
    }
    this.firebaseService.updateProjectInterval(this.currentProjectId, this.updatedProjectInterval);
  }

  updateCurrentPoints() {
    if (!this.inputIsValid(this.updatedCurrentPoints)) {
      return;
    }
    this.firebaseService.updateCurrentPoints(this.currentProjectId, this.updatedCurrentPoints);
  }

  updateCurrentLevel() {
    if (!this.inputIsValid(this.updatedLevel)) {
      return;
    }
    this.firebaseService.updateCurrentLevel(this.currentProjectId, this.updatedLevel);
  }

  inputIsValid(input: any): boolean {
    return (!isNaN(input) && input >= 0 && input);
  }

  navToTasks() {
    this.routes.navigateByUrl('/project/' + this.currentProjectId + '/task/list');
  }

  deleteMembers(member) {
    this.db.list('/projects/' + this.currentProjectId + '/members').remove(member.$key);
  }

  addMember() {
    console.log(this.newMember);
    this.db.list('/projects/' + this.currentProjectId + '/members').push(this.newMember);
  }
}

