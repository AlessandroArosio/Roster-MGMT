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
  private rotaDeleted = false;

  constructor(public rotaService: RotaService, public usersService: UsersService) {}

  ngOnInit() {
    this.isLoading = true;
    this.rotaService.getRotas();
    this.usersService.getUsers();
    this.rotasSub = this.rotaService
      .getRotaUpdateListener()
      .subscribe((rotas: Rota[]) => {
        this.isLoading = false;
        // the below gets updated onDelete
        this.rotas = rotas;
        this.normaliseArray(rotas);
        console.log(this.rotas);
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
    const rotasCopy = arr.slice(0);
    for (let i = 0; i <= rotasCopy.length; i++) {
      const tempArr = rotasCopy.splice(0, 7);
      sevenShiftsPerUser.push(tempArr);
    }
    return sevenShiftsPerUser;
  }

  onDelete(rotaId: string) {
    this.rotaService.deleteRota(rotaId);
    this.rotaDeleted = true;
  }

  private normaliseArray(rotas) {
    let found = false;
    for (let i = 0; i < rotas.length; i++) {
      for (let j = 0; j < this.rosters.length; j++) {
        if (rotas[i].branchName === rotas[j].branchName) {
          console.log(this.rotas.filter(rota => rota.id !== this.rotas[i].id));
          // if (rotas[i].id !== this.rosters[i].weeklyRota[j].id) {console.log('equal'); }
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
  }

  ngOnDestroy() {
    this.rotasSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

}
