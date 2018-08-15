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
  isLoading = false;
  private usersSub: Subscription;

  constructor(public usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.isLoading = false;
        this.users = users;
      });
  }

  onDelete(userId: string) {
    this.usersService.deleteUser(userId);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
