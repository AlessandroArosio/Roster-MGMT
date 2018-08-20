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
import {NgForm} from '@angular/forms';

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



  addRota(rota) {
    // const rota: Rota = {
    //   id: null,
    //   branchName: form.value.branchName,
    //   employeeName: form.value.userName0,
    //   monShift: form.value.monShift00,
    //   tueShift: form.value.tueShift01,
    //   wedShift: form.value.wedShift02,
    //   thuShift: form.value.thuShift03,
    //   friShift: form.value.friShift04,
    //   satShift: form.value.satShift05,
    //   sunShift: form.value.sunShift06,
    //   rotaStartDate: form.value.rotaStartDate,
    //   rotaEndDate: form.value.rotaEndDate
    // };
    this.http.post<any>('http://localhost:3000/api/rotas', rota)
      .subscribe((responseData) => {
        const id = responseData.rotaId;
        rota.id = id;
        this.rotas.push(rota);
        this.rotaUpdated.next([...this.rotas]);
      });
  }

  addRotaTest(rota: Rota) {
    // const rota: Rota = {
    //   id: null,
    //   branchName: form.value.branchName,
    //   employeeName: form.value.userName,
    //   monShift: form.value.monShift00,
    //   tueShift: form.value.tueShif01,
    //   wedShift: form.value.wedShift,
    //   thuShift: form.value.thuShift,
    //   friShift: form.value.friShift,
    //   satShift: form.value.satShift,
    //   sunShift: form.value.sunShift,
    //   rotaStartDate: form.value.rotaStartDate,
    //   rotaEndDate: form.value.rotaEndDate
    // };
    console.log(rota);
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

  getRota(id: string) {
    return this.http.get<any>('http://localhost:3000/api/rotas/' + id);
  }
}
