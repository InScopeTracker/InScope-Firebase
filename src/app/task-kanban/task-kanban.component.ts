import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-task-kanban',
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.css']
})
export class TaskKanbanComponent implements OnInit, OnDestroy {
  public project: any;
  public tasks: any;
  public currentProjectId: any;
  private taskSubscription: Subscription;
  private projectSubscription: Subscription;

  public statuses: string[];

  constructor(private firebaseService: FirebaseService,
              private route: ActivatedRoute,
              private dragulaService: DragulaService) {
    dragulaService.dropModel.subscribe((value) => {
      const el = value[1];
      const target = value[2];
      const taskId = el.getAttribute('id');
      const targetTaskStatus = target.getAttribute('id');

      if (!taskId || !targetTaskStatus) {
        // TODO: What should we do if there isn't a task ID or if something fails?
        return;
      }
      this.firebaseService.getTask(taskId).update({taskStatus: targetTaskStatus});
    });
  }

  ngOnInit() {
    this.currentProjectId = this.route.snapshot.parent.parent.params['id'];
    this.projectSubscription = this.firebaseService.project.subscribe(project => this.project = project);
    this.taskSubscription = this.firebaseService.getTasks(this.currentProjectId).subscribe(tasks => {
      this.tasks = tasks;
      this.setStatuses();
    });
  }

  ngOnDestroy() {
    this.taskSubscription.unsubscribe();
    this.projectSubscription.unsubscribe();
  }

  setStatuses() {
    const projectTasks = this.tasks;
    this.statuses = this.project.statuses.map(status => {
      return {
        name: status,
        tasks: projectTasks.filter(task => task.taskStatus === status)
      };
    });
  }

  completeTask(task: any) {
    this.firebaseService.completeTask(task.$key, this.currentProjectId);
  }
}
