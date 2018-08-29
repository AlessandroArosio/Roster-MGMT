import {Component, OnInit} from '@angular/core';
import {RotaService} from '../rota.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormControl, NgForm, Validators, FormGroup} from '@angular/forms';
import {Shift} from '../../Shifts/shift.model';
import {User} from '../../users/user.model';
import {Branch} from '../../branches/branch.model';
import {Rota} from '../rota.model';
import {Subscription} from 'rxjs';
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
  form: FormGroup;
  disableSelect = false;
  message: string;
  private mode = 'create';
  private rotaId: string;
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
          const dateInMilliseconds = new Date(Date.parse(this.rota.rotaStartDate));
          this.generateFormControls(this.rota.employeeName.length);
          this.selectedValue = this.rota.employeeName.length;
          this.disableSelect = true;
          const indexOfBranch = this.findBranch(this.rota.branchName);
          this.form.controls['branchName'].setValue(this.branches[indexOfBranch]);
          this.form.controls['datePicker'].setValue(dateInMilliseconds.toISOString());
          this.populateRota(this.rota.employeeName.length);
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
    let rota;
    let usersArray = [];
    let shiftsArray = [];
    let date, startRota, endRota;
    if (this.mode === 'create') {
      date = new Date(form.value.datePicker);
      startRota = date.toDateString();
      const date7 = new Date();
      date7.setDate(date.getDate() + 6);
      endRota = date7.toDateString();
      const shiftsAndUsersObj = this.storeUserAndShifts(form);
      usersArray = shiftsAndUsersObj.usersArray;
      shiftsArray = shiftsAndUsersObj.shiftsArray;

      rota = {
        id: null,
        branchName: form.value.branchName,
        employeeArray: usersArray,
        shifts: shiftsArray,
        rotaStartDate: startRota,
        rotaEndDate: endRota,
      };
      this.rotaService.addRota(rota);
      this.message = 'A new rota has been added';
    } else {
      date = new Date(form.value.datePicker);
      startRota = date.toDateString();
      const date7 = new Date();
      date7.setDate(date.getDate() + 6);
      endRota = date7.toDateString();
      const shiftsAndUsersObj = this.storeUserAndShifts(form);
      usersArray = shiftsAndUsersObj.usersArray;
      shiftsArray = shiftsAndUsersObj.shiftsArray;

      rota = {
        id: this.rotaId,
        branchName: form.value.branchName,
        employeeArray: usersArray,
        shifts: shiftsArray,
        rotaStartDate: startRota,
        rotaEndDate: endRota,
      };
      this.rotaService.updateRota(rota);
      this.message = 'The existing rota has been modified!';
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

  generateFormControls(number: number) {
    this.form = new FormGroup({
      'branchName': new FormControl(null, {validators: [Validators.required]}),
      'employeesNumber': new FormControl(null, {validators: [Validators.required]}),
      'datePicker' : new FormControl(null, {validators: [Validators.required]}),
    });
    this.form.controls['employeesNumber'].setValue(number);
    for (let i = 0; i < number; i++) {
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

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Allow only Mondays to be selected
    return day === 1;
  }

  private populateRota(number: number) {
    const copyShifts = this.rota.shifts.slice(0);
    for (let i = 0; i < number; i++) {
      const userName = 'userName' + i;
      this.form.controls[userName].setValue(this.rota.employeeName[i]);
      for (let j = 0; j < this.day; j++) {
        const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const controlShift = weekDays[j] + 'Shift' + i + j;
        this.form.controls[controlShift].setValue(copyShifts[j]);
      }
      copyShifts.splice(0, 7);
    }
  }

  private storeUserAndShifts(form: NgForm) {
    const usersArray = [];
    const shiftsArray = [];
    const masterArray = [];
    let controllers = 0;

    Object.keys(form.controls).forEach( key => {
      if (key.includes('userName')) {
        controllers++;
        Object.values(form.value).forEach( res => {
          masterArray.push(res);
        });
      }
    });
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
    return {usersArray, shiftsArray};
  }

  private findBranch(branch: string) {
    for (let i = 0; i < this.branches.length; i++) {
      if (this.branches[i].branchName === branch) {
        return i;
      }
    }
  }
}
