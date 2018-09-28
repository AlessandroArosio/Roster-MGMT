import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../users/user.model';
import {Shift} from '../Shifts/shift.model';
import {Rota} from '../rota/rota.model';
import {UsersService} from '../users/users.service';
import {ShiftsService} from '../Shifts/shifts.service';
import {RotaService} from '../rota/rota.service';
import {Subject, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/rotas';

@Component({
  selector: 'app-stats',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  shifts: Shift[] = [];
  rotas: Rota[] = [];
  rosters = [];
  statsHolder = [];
  statsPerUser: [{
    name: string,
    totalShifts: number[]
  }] = [{
    name: '',
    totalShifts: []
  }];
  isLoading = false;
  message = '';
  statsUpdated = new Subject<any>();
  date = new FormControl();
  endDate = new FormControl();
  private usersSub: Subscription;
  private shiftsSub: Subscription;
  private rotasSub: Subscription;

  constructor (
    public usersService: UsersService,
    public shiftsService: ShiftsService,
    public rotaService: RotaService,
    public http: HttpClient) {}

  ngOnInit() {
    this.isLoading = true;
    this.shiftsService.getShifts();
    this.usersService.getUsers();
    this.rotaService.getRotas();
    this.shiftsSub = this.shiftsService
      .getShiftUpdateListener()
      .subscribe((shifts: Shift[]) => {
        this.isLoading = false;
        this.shifts = shifts;
      });
    this.rotasSub = this.rotaService
      .getRotaUpdateListener()
      .subscribe((rotas) => {
        this.isLoading = false;
        this.rotas = this.rotaService.getRosters();
        this.modifyRotasArray(this.rotas);
        this.calculateNumberOfShifts();
      });
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  modifyRotasArray(arr) {
    let found = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].weeklyRota.length; j++) {
        for (let k = 0; k < arr[i].weeklyRota[j].userRoster[0].employeeName.length; k++) {
          const userStats: {
            empName: string,
            empShifts: string[]
          } = {
            empName: '',
            empShifts: []
          };
          for (let z = 0; z < this.statsHolder.length; z++) {
            if (arr[i].weeklyRota[j].userRoster[0].employeeName[k] === this.statsHolder[z].empName) {
              arr[i].weeklyRota[j].userRoster[0].shifts[0][k].forEach(el => this.statsHolder[z].empShifts.push(el));
              found = true;
            }
          }
          if (!found) {
            userStats.empName = arr[i].weeklyRota[j].userRoster[0].employeeName[k];
            arr[i].weeklyRota[j].userRoster[0].shifts[0][k].forEach(el => userStats.empShifts.push(el));
            found = false;
            this.statsHolder.push(userStats);
          }
          found = false;
        }
      }
    }
  }

  calculateNumberOfShifts() {
    if (this.statsHolder[0].name === '') {
      this.statsHolder.splice(0, 1);
    }
    this.statsHolder.forEach(el => el.empShifts.sort());
    this.shifts.sort();
    let emp = null;
    let tallyUp = [];
    for (let i = 0; i < this.statsHolder.length; i++) {
      emp = this.statsHolder[i].empName;
      let counter = 0;
      for (let j = 0; j < this.shifts.length; j++) {
        for (let k = 0; k < this.statsHolder[i].empShifts.length; k++) {
          if (this.shifts[j].name === this.statsHolder[i].empShifts[k]) {
            counter++;
          }
        }
        tallyUp.push(counter);
        counter = 0;
      }
      this.statsPerUser.push({name: emp, totalShifts: tallyUp});
      tallyUp = [];
    }
    this.statsPerUser.splice(0, 1);
  }

  findUserName(id: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (id === this.users[i].id) {
        return this.users[i].firstName + ' ' + this.users[i].lastName;
      }
    }
  }

  mondayFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent all days but Mondays from being selected.
    return day === 1;
  }

  sundayFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent all days but Mondays from being selected.
    return day === 0;
  }

  dateRange(start: Date, end: Date) {
    this.message = '';
    if (start > end) {
      this.message = 'Start date cannot be greater than end date!';
      return;
    }
    if (start === null || end === null) {
      this.statsHolder = [{
        name: '',
        totalShifts: []
      }];
      this.statsPerUser = [{
        name: '',
        totalShifts: []
      }];
      this.rotas = null;
      this.rosters = null;
      this.rotaService.getRotas();
      this.modifyRotasArray(this.rotas);
      this.calculateNumberOfShifts();
      return;
    }
    this.message = '';
    this.applyFilters(start.getTime(), end.getTime());
  }

  private applyFilters(startDate: number, endDate: number) {
    let filteredRotas;
    const queryParams = `?start=${startDate}&end=${endDate}`;
    this.http
      .get<{message: string, rotas: any}>(BACKEND_URL + queryParams)
      .pipe(map((rotaData) => {
        return rotaData.rotas.map(rotas => {
          filteredRotas = rotas;
          return {
            branchName: rotas.branchName,
            employeeName: rotas.employeeName,
            shifts: rotas.shifts,
            rotaStartDate: rotas.rotaStartDate,
            rotaEndDate: rotas.rotaEndDate,
            id: rotas._id
          };
        });
      }))
      .subscribe(
        (transformedRota) => {
          this.statsHolder = [{
            name: '',
            totalShifts: []
          }];
          this.statsPerUser = [{
            name: '',
            totalShifts: []
          }];
          this.normalise(transformedRota);
          this.modifyRotasArray(this.rosters);
          this.calculateNumberOfShifts();
          this.statsUpdated.next([...this.statsPerUser]);
        }
      );
  }

  private normalise(rotas) {
    let found = false;
    for (let i = 0; i < rotas.length; i++) {
      for (let j = 0; j < this.rosters.length; j++) {
        if (rotas[i].branchName === this.rosters[j].branch) {
          const shifts = this.shiftsPerUser(rotas[i].shifts);
          const obj = {
            startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
            id: rotas[i].id,
            userRoster: [{
              employeeName: rotas[i].employeeName,
              shifts: [shifts]}],
          };
          this.rosters[j].weeklyRota.push(obj);
          found = true;
        }
      }
      if (!found) {
        const shifts = this.shiftsPerUser(rotas[i].shifts);
        this.rosters.push({
          branch: rotas[i].branchName,
          weeklyRota: [{
            id: rotas[i].id,
            startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
            userRoster: [{
              employeeName: rotas[i].employeeName,
              shifts: [shifts]}]
          }]
        });
        found = false;
      }
      found = false;
    }
  }

  private shiftsPerUser(arr: string[]) {
    const sevenShiftsPerUser = [];
    for (let i = 0; i <= arr.length; i++) {
      const tempArr = arr.splice(0, 7);
      sevenShiftsPerUser.push(tempArr);
    }
    return sevenShiftsPerUser;
  }


  ngOnDestroy() {
    this.rotasSub.unsubscribe();
    this.shiftsSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
}
