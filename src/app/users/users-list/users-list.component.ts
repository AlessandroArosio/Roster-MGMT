import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../user.model';
import {Subscription} from 'rxjs';
import {UsersService} from '../users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private usersSub: Subscription;

  constructor(public usersService: UsersService){}

  ngOnInit() {
    this.users = this.usersService.getUsers();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
