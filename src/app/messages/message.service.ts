import {Injectable} from '@angular/core';
import {Message} from './message.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

@Injectable({providedIn: 'root'})
export class MessageService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<{messages: Message[], messagesCount: number}>();

  constructor (private http: HttpClient, public snackBar: MatSnackBar) {}

  getMessages(id: string, messagesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${messagesPerPage}&page=${currentPage}`;
    this.http
      .get<{message: string, messages: any, maxMessages: number}>('http://localhost:3000/api/messages/' + id + queryParams)
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
      'http://localhost:3000/api/messages/' + id);
  }

  addMessage(message: Message) {
    this.http.post<{message: string, messageId: string}>('http://localhost:3000/api/messages', message)
      .subscribe();
  }

  deleteMessage(messageId: string) {
    return this.http.delete('http://localhost:3000/api/messages/' + messageId);
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
