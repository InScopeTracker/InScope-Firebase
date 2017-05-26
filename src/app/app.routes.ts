import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { AuthGuard } from './auth.service';
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task-list/task-list';
import { TaskKanbanComponent } from './task-kanban/task-kanban.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';

export const router: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'project/:project', component: ProjectComponent, canActivate: [AuthGuard], children: [
    { path: '', component: TaskListComponent, canActivate: [AuthGuard] },
    { path: 'list', component: TaskListComponent, canActivate: [AuthGuard] },
    { path: 'kanban', component: TaskKanbanComponent, canActivate: [AuthGuard] },
    { path: 'task/:task', component: TaskComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: ProjectSettingsComponent, canActivate: [AuthGuard] },
  ]}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
