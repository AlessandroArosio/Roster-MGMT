import {Component, OnDestroy, OnInit} from '@angular/core';
import {Rota} from '../rota.model';
import {RotaService} from '../rota.service';
import {Subscription} from 'rxjs';
import {User} from '../../users/user.model';
import {UsersService} from '../../users/users.service';

@Component({
  selector: 'app-rota-list',
  templateUrl: './rota-list.component.html',
  styleUrls: ['./rota-list.component.css']
})
export class RotaListComponent implements OnInit, OnDestroy {
  rotas: Rota[] = [];
  users: User[] = [];
  isLoading = false;
  headerArray = [];
  public rosters = [];
  private rotasSub: Subscription;
  private usersSub: Subscription;

  constructor(public rotaService: RotaService, public usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.rotaService.getRotas();
    this.usersService.getUsers();
    this.rotasSub = this.rotaService
      .getRotaUpdateListener()
      .subscribe((rotas: Rota[]) => {
        this.isLoading = false;
        this.rotas = rotas;
        let found = false;
        for (let i = 0; i < rotas.length; i++) {
          for (let j = 0; j < this.rosters.length; j++) {
            if (rotas[i].branchName === rotas[j].branchName) {
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
            this.headerArray.push(rotas[i].branchName);
            this.rosters.push({
              branch: rotas[i].branchName,
              id: rotas[i].id,
              weeklyRota: [{
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
          console.log(this.rosters);
      });
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  findUserName(id: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (id === this.users[i].id) {
        return this.users[i].firstName + ' ' + this.users[i].lastName;
      }
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

  onDelete(rotaId: string) {
    this.rotaService.deleteRota(rotaId);
  }

  ngOnDestroy() {
    this.rotasSub.unsubscribe();
  }

}
