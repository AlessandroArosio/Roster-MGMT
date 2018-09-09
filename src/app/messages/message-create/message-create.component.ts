import {Component} from '@angular/core';
import {Message} from '../message.model';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from '../message.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-message-create',
  templateUrl: './message-create.component.html',
  styleUrls: ['./message-create.component.css']
})
export class MessageCreateComponent {
  message: Message;
  private messageId: string;

  constructor (public messageService: MessageService, public route: ActivatedRoute) {}

  onSaveMessage(form: NgForm) {
    if (form.invalid) {
      console.log(form);
      return;
    }
    console.log(form);
    this.messageService.addMessage(this.message);
  }
}
