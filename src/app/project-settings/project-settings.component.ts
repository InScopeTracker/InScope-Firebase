import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit, OnDestroy {

  public currentProjectId: any;
  public currentProject: FirebaseObjectObservable<any>;
  public updatedProjectInterval: number;
  public updatedCurrentPoints: number;
  public updatedLevel: number;
  public newMember: any;
  public members: any[];
  private userProfiles: Observable<any[]>;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  constructor(private db: AngularFireDatabase,
              private firebaseService: FirebaseService,
              private routes: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentProjectId = this.route.parent.snapshot.params['id'];
    this.currentProject = this.firebaseService.project;
    this.members = this.firebaseService.getProjectMembers();
    this.userProfiles = this.db.list('/userProfiles');
  }

  ngOnDestroy() {
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
    this.db.list('/userProfiles/' + member.$key + '/projects').remove(this.currentProjectId);
    this.members = this.firebaseService.getProjectMembers();
  }

  addMember() {
    this.firebaseService.addProjectMember(this.currentProjectId, this.newMember);
    this.members = this.firebaseService.getProjectMembers();
  }
}

