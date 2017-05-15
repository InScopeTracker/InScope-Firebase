import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  public newProject: string;
  public projects: FirebaseListObservable<any>;

  constructor(public authService: AuthService) {
    this.projects = this.authService.projects;
   }

  ngOnInit() {
  }

  verifyUser(email) {
    return email === this.authService.email;
  }

  createProject() {
    this.authService.createProject(this.newProject);
    this.newProject = '';
  }
}
