import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../users/user.model';
import {Shift} from '../Shifts/shift.model';
import {Rota} from '../rota/rota.model';
import {UsersService} from '../users/users.service';
import {ShiftsService} from '../Shifts/shifts.service';
import {RotaService} from '../rota/rota.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-stats',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  users: User[] = [];
  shifts: Shift[] = [];
  rotas: Rota[] = [];
  statsHolder = [];
  isLoading = false;
  private usersSub: Subscription;
  private shiftsSub: Subscription;
  private rotasSub: Subscription;

  constructor (
    public usersService: UsersService,
    public shiftsService: ShiftsService,
    public rotaService: RotaService) {}

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
        console.log(this.statsHolder);
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
          let userStats: {
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

  }

  ngOnDestroy() {
    this.rotasSub.unsubscribe();
    this.shiftsSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
}
