import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from '../message.model';
import {MessageService} from '../message.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {User} from '../../users/user.model';
import {UsersService} from '../../users/users.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.css']
})
export class MessageCreateComponent implements OnInit, OnDestroy {
  message: Message;
  users: User[] = [];
  isLoading = false;
  private messageId: string;
  private userIsAuthenticated: boolean;
  private adminLogged: boolean;
  private authListenerSubs: Subscription;
  private usersSub: Subscription;

  constructor (
    public messageService: MessageService,
    public authService: AuthService,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.adminLogged = this.authService.isAdminLogged();
      });
    this.usersService.getUsers();
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.isLoading = false;
        this.users = users;
      });
  }

  onSendMessage(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.users.forEach(user => {
      if (user.email !== 'admin@local.com') {
        const message: Message = {
          id: null,
          sender: 'admin@local.com',            // this is the user's EMAIL!!!!!
          receiver: user.id,                    // this is the user's ID!!!
          message: form.value.formMessage
        };
        this.messageService.addMessage(message);
      }
    });
    form.reset();
    this.messageService.openSnackBar('Your message has been sent.');
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
