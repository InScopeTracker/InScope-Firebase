import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  authToken: any;
  public tasks: FirebaseListObservable<any>;
  public currentProjectId: any;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              public af: AngularFire,
              private route: ActivatedRoute) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key);
  }
}
