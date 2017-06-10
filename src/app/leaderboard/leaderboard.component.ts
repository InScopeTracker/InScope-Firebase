import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit {

    public leaderboard = [];
    public currentProjectId: any;

    constructor(private firebaseService: FirebaseService,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.currentProjectId = this.route.snapshot.params['id'];
        this.firebaseService.getLeaderboard(this.currentProjectId).subscribe(leaders => {
            leaders.forEach(userLeader => {
                const data = {user: this.firebaseService.getUser(userLeader.$key),
                    points: userLeader.$value};
                this.leaderboard.unshift(data);
            });
        });
    }
}
