import {Component, OnDestroy, OnInit} from '@angular/core';
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
  rotas = [];
  users: User[] = [];
  isLoading = false;
  rotaNotUpdated = [];
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
      .subscribe((rotas) => {
        this.isLoading = false;
        console.log(rotas);
        this.rotas = this.rotaService.getRosters();
        console.log(this.rotas);
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

  onDelete(rotaId: string) {
    this.rotaService.deleteRota(rotaId);
    this.rotaDeleted = true;
  }

  ngOnDestroy() {
    this.rotasSub.unsubscribe();
    this.usersSub.unsubscribe();
  }

}
