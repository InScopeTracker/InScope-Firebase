import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { FilterPipe } from '../services/filter.pipe';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public projects: any;
  public user: FirebaseObjectObservable<any>;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  constructor(private authService: AuthService,
              private firebaseService: FirebaseService,
              public app: AppComponent,
              private router: Router,
              private db: AngularFireDatabase) { }

  navToTasks(project) {
    this.app.currentProject = project.$key;
    this.router.navigateByUrl('/project/' + project.$key + '/task/list');
  }

  ngOnInit() {
    this.projects = this.firebaseService.getProjects();
    this.user = this.firebaseService.getUser(this.authService.user.uid);
  }

  ngOnDestroy() {
  }
}
