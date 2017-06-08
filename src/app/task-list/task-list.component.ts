import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  public tasks: FirebaseListObservable<any>;
  public currentProjectId: any;

  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.tasks = this.firebaseService.getTasks(this.currentProjectId);
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key, this.currentProjectId);
  }
}
