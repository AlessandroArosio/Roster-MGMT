import {Component, OnDestroy, OnInit} from '@angular/core';

import { Shift } from '../shift.model';
import {ShiftsService} from '../shifts.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.css']
})
export class ShiftListComponent implements OnInit, OnDestroy {
  shifts: Shift[] = [];
  isLoading = false;
  private shiftsSub: Subscription;

  constructor(public shiftsService: ShiftsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.shiftsService.getShifts();
    this.shiftsSub = this.shiftsService
      .getShiftUpdateListener()
      .subscribe((shifts: Shift[]) => {
        this.isLoading = false;
        this.shifts = shifts;
      });
  }

  onDelete(shiftId: string) {
    this.shiftsService.deleteShift(shiftId);
  }

  ngOnDestroy() {
    this.shiftsSub.unsubscribe();
  }

}
