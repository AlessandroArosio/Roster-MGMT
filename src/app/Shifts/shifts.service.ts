import {Shift} from './shift.model';
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ShiftsService {
  private shifts: Shift[] = [];
  private shiftsUpdated = new Subject<Shift[]>();

  getShifts() {
    return [...this.shifts];
  }

  getShiftUpdateListener() {
    return this.shiftsUpdated.asObservable();
  }

  addShift(name: string, start: string, end: string) {
    const shift: Shift = {name: name, start: start, end: end};
    this.shifts.push(shift);
    this.shiftsUpdated.next([...this.shifts]);
  }
}
