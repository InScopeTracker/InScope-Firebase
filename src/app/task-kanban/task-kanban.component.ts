import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../services/filter.pipe';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-task-kanban',
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.css']
})
export class TaskKanbanComponent implements OnInit {
  authToken: any;
  public tasks: any;
  public currentProjectId: any;
  statuses = ['To-Do', 'Delegated', 'Doing'];

  constructor(private firebaseService: FirebaseService,
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
    this.firebaseService.getTasks(this.currentProjectId).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key);
  }

  filterTaskStatus(task, status){
    return task.taskStatus == status;
  }
}
