import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule} from 'angularfire2';

import { AppComponent } from './app.component';
import { AuthService } from './providers/auth.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProjectComponent } from './project/project.component';


export const firebaseConfig = {
    apiKey: 'AIzaSyCXEdBDFU1BSbcteFDK7ueX_LzksCyC5tA',
    authDomain: 'inscope-tracker-1f500.firebaseapp.com',
    databaseURL: 'https://inscope-tracker-1f500.firebaseio.com',
    projectId: 'inscope-tracker-1f500',
    storageBucket: 'inscope-tracker-1f500.appspot.com',
    messagingSenderId: '859825004902'
  };

const routes: Routes = [
  { path: '', component: ProjectComponent },
  { path: 'login', component: LoginPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
