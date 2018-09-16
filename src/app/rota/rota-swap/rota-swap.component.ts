import {Component, OnDestroy, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {UsersService} from '../../users/users.service';
import {AuthService} from '../../auth/auth.service';
import {Rota} from '../rota.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../../users/user.model';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {MessageService} from '../../messages/message.service';
import {Message} from '../../messages/message.model';

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
  location: string;
  form: FormGroup;
  message: string;
  errorMessage: string;
  private rotaId: string;
  private rotasSub: Subscription;
  private usersSub: Subscription;

  constructor(
    public rotaService: RotaService,
    public usersService: UsersService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.rotaService.getRotas();
    this.usersService.getUsers();
    this.form = new FormGroup({
      'userName': new FormControl(null, {validators: [Validators.required]}),
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
          this.location = rotaData.branchName;
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
    if (form.value.datePicker > form.value.datePicker2) {
      this.errorMessage = 'Starting date cannot be greater than ending date';
      return;
    }
    if (form.invalid) {
      return;
    } else {
      const textToSend =
        'Shift swap request' + this.normaliseDates(form.value.datePicker, form.value.datePicker2);
      const message: Message = {
        id: null,
        sender: this.loggedUser,            // this is the user's EMAIL!!!!!
        receiver: form.value.userName,      // this is the user's ID!!!
        message: textToSend
      };
      this.errorMessage = '';
      this.messageService.addMessage(message);
      this.message = 'Your request has been sent';
    }
  }

  private normaliseDates(start: Date, end: Date) {
    const startDate = start.toDateString();
    const endDate = end.toDateString();
    return ' from ' + startDate + ', to ' + endDate + ' in the branch ' + this.location;
  }
}
