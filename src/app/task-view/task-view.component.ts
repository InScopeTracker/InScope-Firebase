import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  public task: FirebaseObjectObservable<any>;

  constructor(private firebaseService: FirebaseService,
              public app: AppComponent,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.task = this.firebaseService.getTask(this.route.snapshot.params['id']);
  }

}
