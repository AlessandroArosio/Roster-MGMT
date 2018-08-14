import {User} from './user.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Shift} from '../Shifts/shift.model';

@Injectable({providedIn: 'root'})
export class UsersService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http.get<{message: string, users: User[]}>('http://localhost:3000/api/users')
      .subscribe((shiftData) => {
        this.users = shiftData.users;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(firstName: string, lastName: string, email: string, telephone: number) {
    const user: User = {
      id: null,
      firstName: firstName,
      lastName: lastName,
      email: email,
      telephone: telephone
    };
    this.http.post<{message: string}>('http://localhost:3000/api/shifts', user)
      .subscribe((responseData) => {
        console.log(responseData);
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
      });
  }
}
