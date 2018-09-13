import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from '../message.model';
import {Subscription} from 'rxjs';
import {MessageService} from '../message.service';
import {UsersService} from '../../users/users.service';
import {User} from '../../users/user.model';
import {AuthService} from '../../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  users: User[] = [];
  isLoading = false;
  isSwap = false;
  isAdmin = false;
  loggedUserId: string;
  private messagesSub: Subscription;
  private usersSub: Subscription;

  constructor(
    public messagesService: MessageService,
    public userService: UsersService,
    public authService: AuthService,
    public http: HttpClient,
    public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUsers();
    this.usersSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
        this.loggedUserId = this.getUserId();
        this.isAdmin = this.authService.isAdminLogged();
        this.messagesService.getMessages(this.loggedUserId);
      });
    this.messagesSub = this.messagesService
      .getMessageUpdateListener()
      .subscribe((messages: Message[]) => {
        this.isLoading = false;
        this.messages = messages;
        this.addSwapBoolean(messages);
      });
  }

  onDelete(messageId: string) {
    this.messagesService.deleteMessage(messageId);
  }

  private getUserId() {
    const userEmail = this.authService.userLoggedIn();
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === userEmail) {
        return this.users[i].id;
      }
    }
    return null;
  }

  private getAdminId() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === 'admin@local.com') {
        return this.users[i].id;
      }
      return null;
    }
  }

  private addSwapBoolean(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].message.includes('swap')) {
        arr[i].isSwap = true;
      }
    }
  }

  acceptSwap(message: Message) {
    let receiverEmail;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === this.loggedUserId) {
        receiverEmail = this.users[i].email;
      }
    }
    const newMessage = {
      id: null,
      sender: this.authService.emailAuthenticated,
      receiver: this.getAdminId(),
      message: receiverEmail + ' has accepted the following:\n' +
        message.message + ', from ' + message.sender
    };
    this.http.post<{message: string, messageId: string}>('http://localhost:3000/api/messages', newMessage)
      .subscribe();
    this.onDelete(message.id);
    this.messagesService.openSnackBar('Request accepted. A message has been sent to the admin');

  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
}
