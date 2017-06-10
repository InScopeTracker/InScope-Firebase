import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import {Subject} from "rxjs/Subject";


@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit, OnDestroy {

    public leaderboard = [];
    public currentProjectId: any;
    componentDestroyed$: Subject<boolean> = new Subject();

    constructor(private firebaseService: FirebaseService,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.currentProjectId = this.route.snapshot.params['id'];
        this.firebaseService.getLeaderboard(this.currentProjectId).takeUntil(this.componentDestroyed$).subscribe(leaders => {
            this.leaderboard = [];
            leaders.forEach(userLeader => {
                const data = {user: this.firebaseService.getUser(userLeader.$key),
                    points: userLeader.$value};
                this.leaderboard.unshift(data);
            });
        });
    }

    ngOnDestroy(){
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }
}
