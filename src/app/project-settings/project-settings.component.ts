import { Component, OnInit } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs/Observable';
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
  public newMember: any;
  private projMembers$: Observable<any[]>;
  private userProfiles: Observable<any[]>;

  constructor(private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private routes: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
    this.projMembers$ = this.db.list('/projects/' + this.currentProjectId + '/members');
    this.userProfiles = this.db.list('/userProfiles');
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
    // const updates = {};
    // updates[`/projects/${this.currentProjectId}/members/${this.newMember.uid}`] = `${this.newMember.email}`;
    // this.db.database.ref().update(updates);
  }
}

