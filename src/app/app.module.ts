import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { routes } from './app.routes';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskKanbanComponent } from './task-kanban/task-kanban.component';
import { ProjectSettingsComponent } from './project-settings/project-settings.component';
import { TasksViewComponent } from './tasks-view/tasks-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FirebaseService } from './services/firebase.service';
import { FilterPipe } from './services/filter.pipe';
import { ModalComponent } from './modal/modal.component';

export const firebaseConfig = {
    apiKey: 'AIzaSyCXEdBDFU1BSbcteFDK7ueX_LzksCyC5tA',
    authDomain: 'inscope-tracker-1f500.firebaseapp.com',
    databaseURL: 'https://inscope-tracker-1f500.firebaseio.com',
    projectId: 'inscope-tracker-1f500',
    storageBucket: 'inscope-tracker-1f500.appspot.com',
    messagingSenderId: '859825004902'
  };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProjectComponent,
    TaskComponent,
    TaskListComponent,
    TaskKanbanComponent,
    ProjectSettingsComponent,
    TasksViewComponent,
    TaskViewComponent,
    TaskEditComponent,
    PageNotFoundComponent,
    FilterPipe,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    routes
  ],
  providers: [AuthGuard, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
