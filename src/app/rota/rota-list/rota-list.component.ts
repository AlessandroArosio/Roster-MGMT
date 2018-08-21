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
displayedColumns: string[] = ['employeeName', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
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
      console.log(rotas);
      console.log(rotas[1].branchName.toString());
      for (let i = 0; i < rotas.length; i++) {
        this.headerArray.push(rotas[i].branchName);
      }
      console.log(this.headerArray.toString());
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
