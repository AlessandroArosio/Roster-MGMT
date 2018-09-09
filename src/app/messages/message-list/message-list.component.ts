import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from '../message.model';
import {Subscription} from 'rxjs';
import {MessageService} from '../message.service';
import {UsersService} from '../../users/users.service';
import {User} from '../../users/user.model';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  users: User[] = [];
  isLoading = false;
  loggedUserId: string;
  private messagesSub: Subscription;
  private usersSub: Subscription;

  constructor (
    public messagesService: MessageService,
    public userService: UsersService,
    public authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userService.getUsers();
    this.usersSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
        console.log(this.users);
        this.loggedUserId = this.getUserId();
        console.log(this.loggedUserId);
        this.messagesService.getMessages(this.loggedUserId);
      });
    this.messagesSub = this.messagesService
      .getMessageUpdateListener()
      .subscribe((messages: Message[]) => {
        this.isLoading = false;
        this.messages = messages;
        console.log(messages);
      });
    console.log(this.messages);
  }

  onDelete(messageId: string) {
    this.messagesService.deleteMessage(messageId);
  }

  private getUserId() {
    const userEmail = this.authService.userLoggedIn();
    console.log(userEmail);
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].email === userEmail) {
        return this.users[i].id;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.messagesSub.unsubscribe();
    this.usersSub.unsubscribe();
  }
}
