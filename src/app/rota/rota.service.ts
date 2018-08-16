import {Injectable, OnInit} from '@angular/core';
import {Shift} from '../Shifts/shift.model';
import {User} from '../users/user.model';
import {Branch} from '../branches/branch.model';
import {Rota} from './rota.model';
import {ShiftsService} from '../Shifts/shifts.service';
import {HttpClient} from '@angular/common/http';
import {Subject, Subscription} from 'rxjs';
import {UsersService} from '../users/users.service';
import {BranchesService} from '../branches/branches.service';

@Injectable({providedIn: 'root'})
export class RotaService {

  isLoading = false;
  private shifts: Shift[] = [];
  private users: User[] = [];
  private branches: Branch[] = [];
  private rotas: Rota[] = [];
  private shiftsUpdated = new Subject<Shift[]>();
  private usersUpdated = new Subject<User[]>();
  private branchesUpdated = new Subject<Branch[]>();
  private rotaUpdated = new Subject<Rota[]>();
  private shiftsSub: Subscription;
  private usersSub: Subscription;
  private branchesSub: Subscription;

  constructor(
    private http: HttpClient,
    public shiftsService: ShiftsService,
    public usersService: UsersService,
    public branchesService: BranchesService
  ) {}



  addRota(
    branchName: string,
    userFirstName: string,
    userLastName: string,
    shiftName: string,
    shiftStart: string,
    shiftEnd: string,
    rotaStartDate: string,
    rotaEndDate: string) {
    const rota: Rota = {
      id: null,
      branchName: branchName,
      userFirstName: userFirstName,
      userLastName: userLastName,
      shiftName: shiftName,
      shiftStart: shiftStart,
      shiftEnd: shiftEnd,
      rotaStartDate: rotaStartDate,
      rotaEndDate: rotaEndDate
    };
    this.http.post<any>('http://localhost:3000/api/rota', rota)
      .subscribe((responseData) => {
        const id = responseData.rotaId;
        rota.id = id;
        this.rotas.push(rota);
        this.rotaUpdated.next([...this.rotas]);
      });
  }

  getShiftUpdateListener() {
    return this.shiftsUpdated.asObservable();
  }

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getBranchUpdateListener() {
    return this.branchesUpdated.asObservable();
  }
}
