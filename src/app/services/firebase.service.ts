import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2';

@Injectable()
export class FirebaseService {
    projects: FirebaseListObservable<any[]>;
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
        }) as FirebaseListObservable<Project[]>
        return this.projects;
    }
}

interface Project {
    $key?: string,
    title?: string,
    owner?: string,
    timestamp: Date,
}