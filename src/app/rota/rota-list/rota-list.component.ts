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
  specialCounter = 0;
  arrayOfShifts = [];
  arrayOfUsers = [['mike', 'bob', 'ann'], ['john']];
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
          for (let j = 0; j < this.boh.length; j++) {
            if (rotas[i].branchName === rotas[j].branchName) {
              // generate an array of array containing 7 elements (shift) and store in line 46
              const obj = {
                startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
                userRoster: [{
                  employeeName: rotas[i].employeeName,
                  shifts: [rotas[i].shifts]}],
              };
              this.boh[j].weeklyRota.push(obj);

              found = true;
            }
          }
          if (!found) {
            // generate one array of array containing 7 elements (shift) each and store the variable in line 61
            this.headerArray.push(rotas[i].branchName);
            this.boh.push({
              branch: rotas[i].branchName,
              weeklyRota: [{
                startDate: rotas[i].rotaStartDate + ' <---> ' + rotas[i].rotaEndDate,
                userRoster: [{
                  employeeName: rotas[i].employeeName,
                  shifts: [rotas[i].shifts]}]
              }]
            });
            found = false;
          }
          found = false;
        }
        console.log(rotas);
        console.log(this.boh);
        console.log(this.boh[1].weeklyRota[0].userRoster[0].employeeName);
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
