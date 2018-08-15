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
  private mode = 'create';
  private userId: string;

  constructor(public usersService: UsersService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.mode = 'edit';
        this.userId = paramMap.get('userId');
        this.usersService.getUser(this.userId).subscribe(userData => {
          this.user = {
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            telephone: userData.telephone
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
        form.value.telephone
      );
    } else {
      this.usersService.updateUser(
        this.userId,
        form.value.firstName,
        form.value.lastName,
        form.value.email,
        form.value.telephone
      );
    }
    form.resetForm();
  }
}
