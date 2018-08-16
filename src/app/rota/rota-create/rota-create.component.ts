import {Component, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, NgForm, Validators, ReactiveFormsModule} from '@angular/forms';
import {Shift} from '../../Shifts/shift.model';
import {User} from '../../users/user.model';
import {Branch} from '../../branches/branch.model';
import {Rota} from '../rota.model';
import {Subject, Subscription} from 'rxjs';
import {ShiftsService} from '../../Shifts/shifts.service';
import {UsersService} from '../../users/users.service';
import {BranchesService} from '../../branches/branches.service';

@Component({
  selector: 'app-rota-create',
  templateUrl: './rota-create.component.html',
  styleUrls: ['./rota-create.component.css']
})
export class RotaCreateComponent implements OnInit {

  isLoading = false;
  shifts: Shift[] = [];
  users: User[] = [];
  branches: Branch[] = [];
  rotas: Rota[] = [];
  Arr = Array;
  day = 7;
  formControl = new FormControl(null, [Validators.required]);
  branchControl = new FormControl(null, Validators.required);
  private shiftsUpdated = new Subject<Shift[]>();
  private usersUpdated = new Subject<User[]>();
  private branchesUpdated = new Subject<Branch[]>();
  private rotaUpdated = new Subject<Rota[]>();
  private shiftsSub: Subscription;
  private usersSub: Subscription;
  private branchesSub: Subscription;

  constructor(
    public rotaService: RotaService,
    public route: ActivatedRoute,
    public shiftsService: ShiftsService,
    public usersService: UsersService,
    public branchesService: BranchesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.shiftsService.getShifts();
    this.usersService.getUsers();
    this.branchesService.getBranches();
    this.shiftsSub = this.shiftsService
      .getShiftUpdateListener()
      .subscribe((shifts: Shift[]) => {
        this.isLoading = false;
        this.shifts = shifts;
      });
    this.usersSub = this.usersService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.users = users;
      });
    this.branchesSub = this.branchesService
      .getBranchUpdateListener()
      .subscribe((branches: Branch[]) => {
        this.branches = branches;
      });
  }

  onSaveRota(form: NgForm) {
    if (form.invalid) {
      console.log('Form is invalid');
      return;
    } else {
      console.log('Form is valid');
      console.log(form.value.branchName);
    }

  }
}
