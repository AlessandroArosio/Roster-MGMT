import {User} from './user.model';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Shift} from '../Shifts/shift.model';
import {last, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/users';

@Injectable({providedIn: 'root'})
export class UsersService {
  private users: User[] = [];
  private addUserError: string;
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  getUsers() {
    this.http
      .get<{message: string, users: any}>(BACKEND_URL)
      .pipe(map((usersData) => {
        return usersData.users.map(users => {
          return {
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            telephone: users.telephone,
            id: users._id,
            password: users.password
          };
        });
      }))
      .subscribe((transformedUser) => {
        this.users = transformedUser;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUser(id: string) {
    return this.http.get<{
      _id: string,
      firstName: string,
      lastName: string,
      email: string,
      telephone: number,
      password: string}>
    (
      BACKEND_URL + '/' + id);
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  addUser(firstName: string, lastName: string, email: string, telephone: number, password: string) {
    const user: User = {
      id: null,
      firstName: firstName,
      lastName: lastName,
      email: email,
      telephone: telephone,
      password: password
    };
    return this.http.post<{message: string, userId: string}>(BACKEND_URL, user)
      .subscribe((responseData) => {
          const id = responseData.userId;
          user.id = id;
          this.users.push(user);
          this.usersUpdated.next([...this.users]);
        this.snackBar.open('User successfully created', null, {
          duration: 5000,
        });
        }, error => {
        this.snackBar.open('ERROR: Email already in database', null, {
          duration: 5000,
        });
        }
      );
  }

  updateUser(id: string, firstName: string, lastName: string, email: string, telephone: number, password: string) {
    const user: User = { id: id, firstName: firstName, lastName: lastName, email: email, telephone: telephone, password: password };
    this.http.put(BACKEND_URL + '/' + id, user)
      .subscribe(response => {

        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex(p => p.id === user.id);
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  deleteUser(userId: string) {
    this.http.delete(BACKEND_URL + '/' + userId)
      .subscribe(() => {
        const updatedUser = this.users.filter(user => user.id !== userId);
        this.users = updatedUser;
        this.usersUpdated.next([...this.users]);
      });
  }
}
