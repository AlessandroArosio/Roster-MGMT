import {Component, OnDestroy, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {UsersService} from '../../users/users.service';
import {AuthService} from '../../auth/auth.service';
import {Rota} from '../rota.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../users/user.model';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-rota-swap',
  templateUrl: './rota-swap.component.html',
  styleUrls: ['./rota-swap.component.css']
})
export class RotaSwapComponent implements OnInit, OnDestroy {
  isLoading = false;
  rota: Rota[] = [];
  rotas = [];
  shifts = [];
  users: User[] = [];
  availableUsers = [];
  loggedUser: string;
  minDate: any;
  maxDate: any;
  date = new FormControl(new Date());
  form: FormGroup;
  private rotaId: string;
  private rotasSub: Subscription;
  private usersSub: Subscription;

  constructor(
    public rotaService: RotaService,
    public usersService: UsersService,
    public authService: AuthService,
    public route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.rotaService.getRotas();
    this.usersService.getUsers();
    this.form = new FormGroup({
      'userName': new FormControl(null, {validators: [Validators.required]}),

      // normalise these dates!
      'datePicker': new FormControl(null, {validators: [Validators.required]}),
      'datePicker2': new FormControl(null, {validators: [Validators.required]})
    });
    this.rotasSub = this.rotaService
      .getRotaUpdateListener()
      .subscribe((rotas) => {
        this.isLoading = false;
        this.rotas = this.rotaService.getRosters();
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('rotaId')) {
        this.rotaId = paramMap.get('rotaId');
        this.isLoading = true;
        this.rotaService.getRota(this.rotaId).subscribe(rotaData => {
          this.rota = rotaData;
          this.minDate = new Date(rotaData.rotaStartDate);
          this.maxDate = new Date(rotaData.rotaEndDate);
          console.log(rotaData);
          this.showSelectedRota(this.rota);
          this.loggedUser = this.authService.userLoggedIn();
        });
      }
    });
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
  }

  private showSelectedRota(arr) {
    for (let i = 0; i <= arr.shifts.length; i++) {
      const tempArr = arr.shifts.splice(0, 7);
      this.shifts.push(tempArr);
    }
    this.showAvailableUsers(arr.employeeName);
  }

  private showAvailableUsers(arr) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email !== 'admin@local.com') {
        for (let j = 0; j < arr.length; j++) {
          if (this.users[i].id === arr[j] && this.users[i].email !== this.authService.userLoggedIn()) {
            this.availableUsers.push(this.users[i]);
          }
        }
      }
    }
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
    this.usersSub.unsubscribe();
  }

  requestSwap(form: NgForm) {
    if (form.invalid) {
      console.log('The form is invalid');
      console.log(form);
    } else {
      console.log('The form is VALID');
      console.log(form);
    }
  }
}
