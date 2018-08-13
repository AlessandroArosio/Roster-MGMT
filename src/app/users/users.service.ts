import {User} from './user.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  getUsers() {
    return [...this.users];
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(firstName: string, lastName: string, email: string, telephone: number) {
    const user: User = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      telephone: telephone
    };
    this.users.push(user);
    this.usersUpdated.next([...this.users]);
  }
}
