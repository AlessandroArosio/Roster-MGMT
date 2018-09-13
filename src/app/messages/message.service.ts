import {Injectable} from '@angular/core';
import {Message} from './message.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

@Injectable({providedIn: 'root'})
export class MessageService {
  private messages: Message[] = [];
  private messagesUpdated = new Subject<Message[]>();

  constructor (private http: HttpClient, public snackBar: MatSnackBar) {}

  getMessages(id: string) {
    const test = 'test';
    this.http
      .get<{message: string, messages: any}>('http://localhost:3000/api/messages/' + id)
      .pipe(map((messageData) => {
        return messageData.messages.map(messages => {
          return {
            sender: messages.sender,
            receiver: messages.receiver,
            message: messages.message,
            id: messages._id
          };
        });
      }))
      .subscribe((transformedMessage) => {
        this.messages = transformedMessage;
        this.messagesUpdated.next([...this.messages]);
      });
  }

  getMessage(id: string) {
    return this.http.get<{_id: string, sender: string, receiver: string, message: string}>(
      'http://localhost:3000/api/messages/' + id);
  }

  addMessage(message: Message) {
    this.http.post<{message: string, messageId: string}>('http://localhost:3000/api/messages', message)
      .subscribe((responseData) => {
        const id = responseData.messageId;
        message.id = id;
        this.messages.push(message);
        this.messagesUpdated.next([...this.messages]);
      });
  }

  deleteMessage(messageId: string) {
    this.http.delete('http://localhost:3000/api/messages/' + messageId)
      .subscribe(() => {
        const updatedMessage = this.messages.filter(message => message.id !== messageId);
        this.messages = updatedMessage;
        this.messagesUpdated.next([...this.messages]);
      });
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
