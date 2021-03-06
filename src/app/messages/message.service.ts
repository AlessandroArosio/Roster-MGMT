import {Injectable} from '@angular/core';
import {Message} from './message.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/messages/';

@Injectable({providedIn: 'root'})
export class MessageService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<{messages: Message[], messagesCount: number}>();

  constructor (private http: HttpClient, public snackBar: MatSnackBar) {}

  getMessages(id: string, messagesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${messagesPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, messages: any, maxMessages: number}>(BACKEND_URL + id + queryParams)
      .pipe(map((messageData) => {
        return  {messages: messageData.messages.map(messages => {
            return {
              sender: messages.sender,
              receiver: messages.receiver,
              message: messages.message,
              id: messages._id
            };
          }),
          maxMessages: messageData.maxMessages
        };
      }))
      .subscribe((transformedMessageData) => {
        this.messages = transformedMessageData.messages;
        this.messagesUpdated.next({
          messages: [...this.messages],
          messagesCount: transformedMessageData.maxMessages
        });
      });
  }

  getMessage(id: string) {
    return this.http.get<{_id: string, sender: string, receiver: string, message: string}>(
      BACKEND_URL + id);
  }

  addMessage(message: Message) {
    this.http.post<{message: string, messageId: string}>(BACKEND_URL, message)
      .subscribe();
  }

  deleteMessage(messageId: string) {
    return this.http.delete(BACKEND_URL + messageId);
  }

  getMessageUpdateListener() {
    return this.messagesUpdated.asObservable();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
