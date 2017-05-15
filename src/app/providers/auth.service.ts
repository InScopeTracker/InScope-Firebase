import { Injectable } from '@angular/core';

import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import * as fb from 'firebase';

@Injectable()
export class AuthService {

  public projects: FirebaseListObservable<any>;
  public users: FirebaseListObservable<any>;
  public displayName: string;
  public email: string;
  public user: FirebaseObjectObservable<any>;
  public owner: string;

  constructor(public af: AngularFire) {
    this.af.auth.subscribe(
      (auth) => {
        if (auth != null) {
          this.user = this.af.database.object('users/' + auth.uid);
        }
      });

      this.projects = this.af.database.list('projects');
      this.users = this.af.database.list('users');
   }

  loginWithGoogle() {
    return this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    });
  }

  logout() {
    return this.af.auth.logout();
  }

  addUserInfo() {
    this.users.push({
      email: this.email,
      displayName: this.displayName
    });
  }

  createProject(text) {
    const project = {
      project: text,
      owner: this.email,
      timestamp: Date.now()
    };
    // Right now this creates items in database with a random name
    // so it is difficult to pull out individual items. The commented out
    // version below is an example of a way to do it with a pre-defined name
    // structure, but currently that version will only create one item and just
    // overwrite it.
    this.projects.push(project);
    // fb.database().ref('projects/' + this.displayName).set(project);
  }
}
