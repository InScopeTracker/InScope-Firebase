import { Component, OnInit } from '@angular/core';
import { AngularFire, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AppComponent } from '../app.component';
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
  authToken: any;

  constructor(private af: AngularFire, private firebaseService: FirebaseService, private route: ActivatedRoute) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.currentProject = this.firebaseService.getProject(this.currentProjectId);
  }

}
