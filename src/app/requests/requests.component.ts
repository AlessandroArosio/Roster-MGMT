import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {User} from '../users/user.model';
import {AuthService} from '../auth/auth.service';
import {UsersService} from '../users/users.service';
import {MessageService} from '../messages/message.service';
import {Message} from '../messages/message.model';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit, OnDestroy {
  message: string;
  errorMessage: string;
  form: FormGroup;
  minDate = new Date();
  users: User[] = [];
  loggedUser: string;
  isLoading = false;
  private usersSub: Subscription;

  constructor(
    public authService: AuthService,
    public usersService: UsersService,
    public messagesService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.usersService.getUsers();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.isLoading = false;
        this.users = users;
      });
    this.loggedUser = this.authService.userLoggedIn();
    this.form = new FormGroup({
      'unpaid': new FormControl(null),
      'datePicker': new FormControl(null, {validators: [Validators.required]}),
      'datePicker2': new FormControl(null, {validators: [Validators.required]})
    });
  }

  submitRequest(form: NgForm) {
    if (form.value.datePicker > form.value.datePicker2) {
      this.errorMessage = 'Starting date cannot be greater than ending date';
      return;
    }
    if (form.invalid) {
      return;
    } else {
      let textToSend = '';
      if (form.value.unpaid === true) {
        textToSend = 'Unpaid holiday request ' + this.normaliseDates(form.value.datePicker, form.value.datePicker2);
      } else {
        textToSend = 'Holiday request ' + this.normaliseDates(form.value.datePicker, form.value.datePicker2);
      }
      const message: Message = {
        id: null,
        sender: this.loggedUser,            // this is the user's EMAIL!!!!!
        receiver: this.getAdminId(),        // this is the user's ID!!!
        message: textToSend
      };
      this.errorMessage = '';
      this.messagesService.addMessage(message);
      this.messagesService.openSnackBar('Request submitted to the admin for approval');

    }
  }

  private normaliseDates(start: Date, end: Date) {
    const startDate = start.toDateString();
    const endDate = end.toDateString();
    return ' from ' + startDate + ', to ' + endDate;
  }

  private getAdminId() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === 'admin@local.com') {
        return this.users[i].id;
      }
      return null;
    }
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }
}
