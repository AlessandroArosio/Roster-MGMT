import {Component, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormControl, NgForm, Validators, ReactiveFormsModule, FormGroup, Form, NgModel} from '@angular/forms';
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
  employees = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  totalEmployees = [];
  selectedValue: number;
  duplicate = false;
  pickert;
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
      'employeesNumber': new FormControl(null, {validators: [Validators.required]}),
      'datePicker' : new FormControl(null, {validators: [Validators.required]})
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
            employeeName: rotaData.employeeName,
            shifts: rotaData.shifts,
            rotaStartDate: rotaData.rotaStartDate,
            rotaEndDate: rotaData.rotaEndDate
          };
          this.form.setValue(
            {
              'branchName': this.rota.branchName,
              'employeeName': this.rota.employeeName,
              'monShift': this.rota.shifts[0],
              'tueShift': this.rota.shifts[1],
              'wedShift': this.rota.shifts[2],
              'thuShift': this.rota.shifts[3],
              'friShift': this.rota.shifts[4],
              'satShift': this.rota.shifts[5],
              'sunShift': this.rota.shifts[6],
            });
        });
      } else {
        this.mode = 'create';
        this.rotaId = null;
      }
    });
  }

  onSaveRota(form: NgForm) {
    if (form.invalid) {
      console.log('Form is invalid');
      console.log(this.form);
      return;
    }
    if (this.mode === 'create') {

      const date = new Date(form.value.datePicker);
      const startRota = date.toDateString();

      const date7 = new Date();
      date7.setDate(date.getDate() + 6);
      const endRota = date7.toDateString();

      const masterArray = [];
      let usersArray = [];
      let shiftsArray = [];
      let controllers = 0;

      Object.keys(form.controls).forEach( key => {
        if (key.includes('userName')) {
            controllers++;
          Object.values(form.value).forEach( res => {
            masterArray.push(res);
          });
        }
      });
      // array containing form controller of each day
      masterArray.splice(0, 3);
      for (let i = 0; i < controllers; i++) {
        usersArray.push(masterArray[0]);
        masterArray.splice(0, 1);
        shiftsArray.push(
          masterArray[0],
          masterArray[1],
          masterArray[2],
          masterArray[3],
          masterArray[4],
          masterArray[5],
          masterArray[6]
          );
        masterArray.splice(0, 7);
      }

      const rota = {
        id: null,
        branchName: form.value.branchName,
        employeeArray: usersArray,
        shifts: shiftsArray,
        rotaStartDate: startRota,
        rotaEndDate: endRota,
      };
      this.rotaService.addRota(rota);
    }
    form.reset();
  }

  employeesPerBranch(number: number) {
    this.selectedValue = number;
    this.totalEmployees = [];
    if (this.selectedValue > number) {
      this.form = new FormGroup({
        'branchName': new FormControl(null, {validators: [Validators.required]}),
        'employeesNumber': new FormControl(null, {validators: [Validators.required]}),
        'datePicker' : new FormControl(null, {validators: [Validators.required]})
      });
      this.form.controls['employeesNumber'].setValue(number);
      for (let i = 0; i < this.selectedValue; i++) {
        this.totalEmployees.push(i);
        const controlName = 'userName' + i;
        this.form.addControl(controlName, new FormControl(null, Validators.required));
        for (let y = 0; y < this.day; y++) {
          const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const controlShift = weekDays[y] + 'Shift' + i + y;
          this.form.addControl(controlShift, new FormControl(null, Validators.required));
        }
      }
    } else {
      this.form = new FormGroup({
        'branchName': new FormControl(null, {validators: [Validators.required]}),
        'employeesNumber': new FormControl(null, {validators: [Validators.required]}),
        'datePicker' : new FormControl(null, {validators: [Validators.required]})
      });
      this.form.controls['employeesNumber'].setValue(number);
      for (let i = 0; i < this.selectedValue; i++) {
        this.totalEmployees.push(i);
        const controlName = 'userName' + i;
        this.form.addControl(controlName, new FormControl(null, Validators.required));
        for (let y = 0; y < this.day; y++) {
          const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
          const controlShift = weekDays[y] + 'Shift' + i + y;
          this.form.addControl(controlShift, new FormControl(null, Validators.required));
        }
      }
    }
  }

  // Check if there are in userName (controlForm) any duplicates users.ID and prevent the submit
  checkDuplicateEmployees() {
    const userArray = [];
    for (let i = 0; i < this.selectedValue; i++) {
      userArray.push('userName' + i);
    }
    for (let i = 0; i < userArray.length; i++) {
      for (let y = 0; y < userArray.length; y++) {
        if (this.form.get(userArray[i]).value === this.form.get(userArray[y]).value && i !== y) {
          this.duplicate = true;
          return;
        }
      }
    }
    this.duplicate = false;
  }
}
