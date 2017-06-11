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
  projectMembers: FirebaseObjectObservable<any>[];
  userProfileSubscriptions: Subscription[];
  taskSubscription: Subscription;
  projectSubscription: Subscription;
  profileExists: boolean;

  constructor(private authService: AuthService,
              private db: AngularFireDatabase) {
    this.userProfileSubscriptions = [];
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
    this.userProfileSubscriptions.forEach(subscription => subscription.unsubscribe());
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

  getProjectMembers() {
    const members = [];
    this.project.take(1).subscribe(project => {
      if (project.members) {
        Object.keys(project.members).forEach(memberId => {
          this.userProfileSubscriptions.push(this.getUser(memberId).take(1).subscribe(member => {
            if (members.indexOf(member) < 0) {
              members.push(member);
            }
          }));
        });
      }
    });
    this.projectMembers = members;
    return this.projectMembers;
  }

  addProjectMember(projectId, memberId) {
    this.db.object(`/projects/${projectId}/members`).$ref.child(memberId).set(true);
    this.db.object(`/userProfiles/${memberId}/projects`).$ref.child(projectId + '/permissions').set(true);
    this.db.object(`/userProfiles/${memberId}/projects`).$ref.child(projectId).update({projectPoints: 0});
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

  getLeaderboard(projectId) {
    return this.db.list('/projects/' + projectId + '/leaderboard/', {
      query: {
        orderByValue: true,
        limitToFirst: 3
      }
    }) as FirebaseListObservable<any[]>;
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
    let points = null;
    const taskSub = this.db.object('/tasks/' + taskKey).subscribe(task => {
      points = Number(task.taskPointValue);
    });
    this.gainProjectExperience(taskKey, projectKey);
    this.updateUserProjectPoints(projectKey, points);
    this.db.object('/tasks/' + taskKey).remove();
    taskSub.unsubscribe();
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

  updateUserProjectPoints(projectKey: string, pointValue: number) {
    let userProject = null;
    const proj = this.db.object('/projects/' + projectKey);
    const projectSub = proj.subscribe(project => {
      if (project.owner === this.authService.user.uid) {
        userProject = this.db.object('/userProfiles/' + this.authService.user.uid + '/projectsOwned/' + projectKey)
      } else {
        userProject = this.db.object('/userProfiles/' + this.authService.user.uid + '/projects/' + projectKey)
      }
    });

    let currentPoints = 0;
    const userSub = userProject.subscribe(user => {
      currentPoints = Number(user.projectPoints);
    });

    currentPoints += Number(pointValue);
    const leaderUpdate = {};
    leaderUpdate['/projects/' + projectKey + '/leaderboard/' + this.authService.user.uid] = currentPoints;
    this.db.database.ref().update(leaderUpdate);
    userProject.update({projectPoints: currentPoints});
    projectSub.unsubscribe();
    userSub.unsubscribe();
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
