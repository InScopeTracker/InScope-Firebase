import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Router, ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css']
})
export class ProjectSettingsComponent implements OnInit {

  public currentProjectId: any;
  public currentProject: FirebaseObjectObservable<any>;
  public updatedProjectInterval: number;
  authToken: any;

  constructor(private af: AngularFire,
              private firebaseService: FirebaseService,
              private routes: Router,
              private route: ActivatedRoute) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
  }

  deleteProject() {
    this.firebaseService.deleteProject(this.currentProjectId);
    this.routes.navigateByUrl('/home');
  }

  updateProjectInterval() {
    this.firebaseService.updateProjectInterval(this.currentProjectId, this.updatedProjectInterval);
  }
}

