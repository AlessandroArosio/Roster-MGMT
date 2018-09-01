import {Component, OnDestroy, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {Subscription} from 'rxjs';
import {User} from '../../users/user.model';
import {UsersService} from '../../users/users.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-rota-list',
  templateUrl: './rota-list.component.html',
  styleUrls: ['./rota-list.component.css']
})
export class RotaListComponent implements OnInit, OnDestroy {
  rotas = [];
  users: User[] = [];
  isLoading = false;
  date = new FormControl();
  endDate = new FormControl();
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
        this.rotas = this.rotaService.getRosters();
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
    if (start > end) {
      console.log('start date is greater than end date');
      return;
    }
    if (start === null || end === null) {
      location.reload();
      return;
    }
    this.rotaService.getFilteredRotas(start.getTime(), end.getTime());
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
