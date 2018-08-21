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
  testArray = [];
  boh = [];
  // boh: [{
  //   branch: string,
  //   weeklyRota: [{
  //     startDate: string,
  //     employeeName: string[],
  //     shifts: string[]
  //   }]
  // }];
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
          for (let j = 0; j < this.testArray.length; j++) {
            if (rotas[i].branchName === rotas[j].branchName) {
              this.testArray[j].manyRotasStart.push(rotas[i].rotaStartDate);
              const obj = {
                startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
                employeeName: rotas[i].employeeName,
                shifts: rotas[i].shifts
              };
              this.boh[j].weeklyRota.push(obj);


              this.testArray[j].manyRotasEnd.push(rotas[i].rotaEndDate);
              rotas[i].employeeName.forEach((user) => {
                this.testArray[j].employeeName.push(user);
              });
              rotas[i].shifts.forEach((shift) => {
                this.testArray[j].shifts.push(shift);
              });
              found = true;
            }
          }
          if (!found) {
            this.headerArray.push(rotas[i].branchName);
            this.boh.push({
              branch: rotas[i].branchName,
              weeklyRota: [{
                startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
                employeeName: rotas[i].employeeName,
                shifts: rotas[i].shifts
              }]
            });

            this.testArray.push({
              branch: rotas[i].branchName,
              manyRotasStart: [rotas[i].rotaStartDate],
              manyRotasEnd: [rotas[i].rotaEndDate],
              shifts: rotas[i].shifts,
              employeeName: rotas[i].employeeName
            });
            found = false;
          }
          found = false;
        }
        console.log(this.testArray);
        console.log(rotas);
        console.log(this.boh);
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


  ngOnDestroy() {
    this.rotasSub.unsubscribe();
  }

}
