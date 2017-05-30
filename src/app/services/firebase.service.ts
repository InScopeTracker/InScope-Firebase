import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Injectable()
export class FirebaseService {
  projects: FirebaseListObservable<any[]>;
  tasks: FirebaseListObservable<any[]>;
  project: FirebaseObjectObservable<any>;
  task: FirebaseObjectObservable<any>;
  authToken: any;

  constructor(private af: AngularFire) {
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.authToken = auth;
      }
    });
  }

  getProjects() {
    this.projects = this.af.database.list('/projects', {
      query: {
        orderByChild: 'owner',
        equalTo: this.authToken.auth.email,
      }
    }) as FirebaseListObservable<Project[]>;
    return this.projects;
  }

  getProject(id) {
    this.project = this.af.database.object('/projects/' + id) as FirebaseObjectObservable<Project>;
    return this.project;
  }

  getTasks(projectId) {
    this.tasks = this.af.database.list('/tasks', {
      query: {
        orderByChild: 'projectId',
        equalTo: projectId,
      }
    }) as FirebaseListObservable<Task[]>;
    return this.tasks;
  }

  getTask(id) {
    this.task = this.af.database.object('/tasks/' + id) as FirebaseObjectObservable<Task>;
    return this.task;
  }

  completeTask(taskKey: string) {
    this.af.database.object('/tasks/' + taskKey).remove();
  }

  deleteProject(projectKey: string) {
    this.af.database.list('/tasks', {
      query: {
        orderByChild: 'projectId',
        equalTo: projectKey
      }
    }).subscribe(res => {
      const key = res[0].$key;
      this.af.database.object('/tasks/' + key).remove();
    });

    this.af.database.object('/projects/' + projectKey).remove();
  }

  updateProjectInterval(projectKey: string, intervalValue: number) {
    const proj = this.getProject(projectKey);
    proj.update({pointInterval: intervalValue});
  }

  updateCurrentPoints(projectKey: string, pointValue: number) {
    const proj = this.getProject(projectKey);
    proj.update({currentPoints: pointValue});
  }
}

interface Project {
  $key?: string;
  title?: string;
  owner?: string;
  pointInterval?: number;
  currentPoints?: number;
  currentLevel?: number;
  timestamp: Date;
}

interface Task {
  $key?: string;
  title?: string;
  owner?: string;
  projectTitle?: string;
  projectId: string;
  timestamp: Date;
}
