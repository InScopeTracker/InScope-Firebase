import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class FirebaseService implements OnDestroy {
  projects: FirebaseListObservable<any[]>;
  users: FirebaseListObservable<any[]>;
  tasks: FirebaseListObservable<any[]>;
  public project: FirebaseObjectObservable<any>;
  task: FirebaseObjectObservable<any>;
  userProfileSubscription: Subscription;
  taskSubscription: Subscription;
  projectSubscription: Subscription;
  profileExists: boolean;

  constructor(private authService: AuthService,
              private db: AngularFireDatabase) {
    this.authService.authState.subscribe((auth) => {
      // If the user is authenticated and doesn't have a user profile, create one.
      if (auth) {
        this.db.object(`/userProfiles/${auth.uid}`).take(1).subscribe((userProfile) => {
          if (!userProfile.$value) {
            this.profileExists = false;
          }
          if (!this.profileExists) {
            this.db.object(`/userProfiles/${this.authService.user.uid}`).update({email: this.authService.user.email});
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.userProfileSubscription.unsubscribe();
  }

  getUsers() {
    this.users = this.db.list('/userProfiles', {
      query: {
        orderByChild: '$key',
        equalTo: this.authService.user.uid,
      }
    }) as FirebaseListObservable<User[]>;
    return this.users;
  }

  getUser(id) {
    return this.db.object('/userProfiles/' + id) as FirebaseObjectObservable<any>;
  }

  getProjects() {
    this.projects = this.db.list('/projects', {
      query: {
        orderByChild: `members/${this.authService.user.uid}`,
        equalTo: true,
      }
    }) as FirebaseListObservable<Project[]>;
    return this.projects;
  }

  getProject(id) {
    this.project = this.db.object('/projects/' + id) as FirebaseObjectObservable<Project>;
    return this.project;
  }

  addProjectMember(projectId, memberId) {
    this.db.object(`/projects/${projectId}/members`).$ref.child(memberId).set(true);
    this.db.object(`/userProfiles/${memberId}/projects`).$ref.child(projectId).set(true);
  }

  getTasks(projectId) {
    this.tasks = this.db.list('/tasks', {
      query: {
        orderByChild: 'projectId',
        equalTo: projectId,
      }
    }) as FirebaseListObservable<Task[]>;
    return this.tasks;
  }

  getTask(id) {
    this.task = this.db.object('/tasks/' + id) as FirebaseObjectObservable<Task>;
    return this.task;
  }

  saveTask(task) {
    return this.tasks.push(task);
  }

  updateTask(taskProperties) {
    return this.task.update(taskProperties);
  }

  completeTask(taskKey: string, projectKey: string) {
    this.gainProjectExperience(taskKey, projectKey);
    this.db.object('/tasks/' + taskKey).remove();
  }

  gainProjectExperience(taskKey: string, projectKey: string) {
    const currentProj = this.getProject(projectKey);
    let projPoints = 0;
    let projLevel = 0;
    let projInterval = 0;
    this.projectSubscription = currentProj.subscribe(proj => {
      projPoints = Number(proj.currentPoints);
      projLevel = Number(proj.currentLevel);
      projInterval = Number(proj.pointInterval);
    });

    const currentTask = this.db.object('/tasks/' + taskKey);
    let taskPoints = 0;
    this.taskSubscription = currentTask.subscribe(task => {
      taskPoints = Number(task.taskPointValue);
    });

    projPoints += taskPoints;
    if (projPoints >= projInterval) {
      projLevel += Math.floor(Number(projPoints / projInterval));
      projPoints %= projInterval;
    }

    this.projectSubscription.unsubscribe();
    this.taskSubscription.unsubscribe();
    this.updateCurrentPoints(projectKey, projPoints);
    this.updateCurrentLevel(projectKey, projLevel);
  }

  deleteTask(taskKey: string) {
    return this.task.remove();
  }

  deleteProject(projectKey: string) {
    this.db.list('/tasks', {
      query: {
        orderByChild: 'projectId',
        equalTo: projectKey
      }
    }).subscribe(res => {
      if (res[0] != null && res[0] !== undefined) {
        const key = res[0].$key;
        this.db.object('/tasks/' + key).remove();
      }
    });

    this.db.object('/projects/' + projectKey).remove();
    this.db.object('/userProfiles/' + this.authService.user.uid + '/projectsOwned/' + projectKey).remove();
  }

  updateProjectInterval(projectKey: string, intervalValue: number) {
    const proj = this.getProject(projectKey);
    proj.update({pointInterval: intervalValue});
  }

  updateCurrentPoints(projectKey: string, pointValue: number) {
    const proj = this.getProject(projectKey);
    proj.update({currentPoints: pointValue});
  }

  updateCurrentLevel(projectKey: string, level: number) {
    const proj = this.getProject(projectKey);
    proj.update({currentLevel: level});
  }
}

interface Project {
  $key?: string;
  title?: string;
  owner?: string;
  members?: string[];
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

interface User {
  $key?: string;
  email?: string;
  projectList?: string;
  timestamp: Date;
}
