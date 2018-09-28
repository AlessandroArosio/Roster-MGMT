import {Component, OnInit} from '@angular/core';
import {UsersService} from '../users.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {User} from '../user.model';

@Component({
  selector: 'app-user-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css']
})
export class UsersCreateComponent implements OnInit {
  user: User;
  isLoading = false;
  message: string;
  private mode = 'create';
  private userId: string;

  constructor(public usersService: UsersService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'edit';
        this.userId = paramMap.get('userId');
        this.isLoading = true;
        this.usersService.getUser(this.userId).subscribe(userData => {
          this.isLoading = false;
          this.user = {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            telephone: userData.telephone,
            password: userData.password
          };
        });
      } else {
        this.mode = 'create';
        this.userId = null;
      }
    });
  }

  onSaveUser(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.usersService.addUser(
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.telephone,
        form.value.password
      );
    } else {
      this.usersService.updateUser(
        this.userId,
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.telephone,
        form.value.password
      );
      this.message = 'User "' + form.value.firstName + ' ' + form.value.lastName + '" has been updated';
    }
    form.resetForm();
  }
}
