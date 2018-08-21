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
import {map} from 'rxjs/operators';

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
  private rotasUpdated = new Subject<Rota[]>();
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
    this.http.post<any>('http://localhost:3000/api/rotas', rota)
      .subscribe((responseData) => {
        const id = responseData.rotaId;
        rota.id = id;
        this.rotas.push(rota);
        this.rotasUpdated.next([...this.rotas]);
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

  getRotaUpdateListener() {
    return this.rotasUpdated.asObservable();
  }

  getRotas() {
    this.http
      .get<{message: string, rotas: any}>('http://localhost:3000/api/rotas')
      .pipe(map((rotaData) => {
        return rotaData.rotas.map(rotas => {
          return {
            branchName: rotas.branchName,
            employeeName: rotas.employeeName,
            shifts: rotas.shifts,
            rotaStartDate: rotas.rotaStartDate,
            rotaEndDate: rotas.rotaEndDate
          };
        });
      }))
      .subscribe((transformedRota) => {
        this.rotas = transformedRota;
        this.rotasUpdated.next([...this.rotas]);
      });
  }

  getRota(id: string) {
    return this.http.get<any>('http://localhost:3000/api/rotas/' + id);
  }
}
