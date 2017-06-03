import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { CallbackPipe } from '../services/filter.pipe';

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
    this.firebaseService.getTasks(this.currentProjectId).subscribe(tasks => {
      this.tasks = tasks;
      console.log(this.tasks);
    }); 
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key);
  }

  filterTaskStatus(task, status){
    return task.taskStatus == status;
  }
}
