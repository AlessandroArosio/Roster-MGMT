import {Component, OnDestroy, OnInit} from '@angular/core';

import { Shift } from '../shift.model';
import {ShiftsService} from '../shifts-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent implements OnInit, OnDestroy {
  // shifts = [
  //   {shiftName: 'Early shift', start: '6:00', end: '14:00'},
  //   {shiftName: 'Late shift', start: '14:00', end: '22:00'},
  //   {shiftName: 'Early shift', start: '22:00', end: '06:00'}
  // ];
  //
  shifts: Shift[] = [];
  private shiftsSub: Subscription;

  constructor(public shiftsService: ShiftsService) {}

  ngOnInit() {
    this.shifts = this.shiftsService.getShifts();
    this.shiftsSub = this.shiftsService
      .getShiftUpdateListener()
      .subscribe((shifts: Shift[]) => {
        this.shifts = shifts;
      });
  }

  ngOnDestroy() {
    this.shiftsSub.unsubscribe();
  }

}
