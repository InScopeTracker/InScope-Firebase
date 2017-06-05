import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { AppComponent } from '../app.component';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireAuth } from 'angularfire2/auth';

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
              public afAuth: AngularFireAuth,
              private route: ActivatedRoute) {
    this.afAuth.idToken.subscribe(auth => {
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
