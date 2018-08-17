import {Component, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormControl, NgForm, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
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
  rota: Rota;
  Arr = Array;
  day = 7;
  userName = 'userName';
  monShift = 'monShift';
  controlShift = ['monShift', 'tueShift', 'wedShift', 'thuShift', 'friShift', 'satShift', 'sunShift'];
  form: FormGroup;
  private mode = 'create';
  private rotaId: string;
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
    this.form = new FormGroup({
      'branchName': new FormControl(null, {validators: [Validators.required]}),
    });
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
        for (let i = 0; i < this.users.length; i++) {
          const controlName = 'userName' + i;
          this.form.addControl(controlName, new FormControl(null, Validators.required));
          for (let y = 0; y < this.day; y++) {
            const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            const controlShift = weekDays[y] + 'Shift' + i + y;
            this.form.addControl(controlShift, new FormControl(null, Validators.required));
            // console.log('i = ' + i + ', y = ' + y);
            // console.log(controlShift);
          }
        }
      });
    this.branchesSub = this.branchesService
      .getBranchUpdateListener()
      .subscribe((branches: Branch[]) => {
        this.branches = branches;
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('rotaId')) {
        this.mode = 'edit';
        this.rotaId = paramMap.get('rotaId');
        this.isLoading = true;
        this.rotaService.getRota(this.rotaId).subscribe(rotaData => {
          this.rota = {
            id: rotaData._id,
            branchName: rotaData.branchName,
            employeeName: rotaData.firstName + ' ' + rotaData.lastName,
            monShift: rotaData.monShift,
            tueShift: rotaData.tueShift,
            wedShift: rotaData.wedShift,
            thuShift: rotaData.thuShift,
            friShift: rotaData.friShift,
            satShift: rotaData.satShift,
            sunShift: rotaData.sunShift,
            rotaStartDate: rotaData.rotaStartDate,
            rotaEndDate: rotaData.rotaEndDate
          };
          this.form.setValue(
            {
              'branchName': this.rota.branchName,
              'employeeName': this.rota.employeeName,
              'monShift': this.rota.monShift,
              'tueShift': this.rota.tueShift,
              'wedShift': this.rota.wedShift,
              'thuShift': this.rota.thuShift,
              'friShift': this.rota.friShift,
              'satShift': this.rota.satShift,
              'sunShift': this.rota.sunShift,
            });
        });
      } else {
        this.mode = 'create';
        this.rotaId = null;
      }
    });
  }

  onSaveRota() {
    if (this.form.invalid) {
      console.log('Form is invalid');
      console.log(this.form.value.shiftName);
      console.log(this.form);
      return;
    } else {
      console.log('Form is valid');
      console.log(this.form);
    }

  }
}