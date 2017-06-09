import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { FilterPipe } from '../services/filter.pipe';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-task-kanban',
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.css']
})
export class TaskKanbanComponent implements OnInit, OnDestroy {
  public tasks: any;
  public currentProjectId: any;
  private taskSubscription: Subscription;

  public statuses: string[];

  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.taskSubscription = this.firebaseService.getTasks(this.currentProjectId).subscribe(tasks => {
      this.tasks = tasks;
      this.setStatuses();
    });
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
  }

  setStatuses() {
    this.statuses = this.tasks.map(task => task.taskStatus);
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key, this.currentProjectId);
  }

  filterTaskStatus(task, status) {
    return task.taskStatus === status;
  }
}
