import {Component} from '@angular/core';
import {UsersService} from '../users.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css']
})
export class UsersCreateComponent {

  constructor(public usersService: UsersService) {}

  onAddUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.usersService.addUser(
      form.value.firstName,
      form.value.lastName,
      form.value.email,
      form.value.telephone
    );
    form.resetForm();
  }
}
