import {Shift} from './shift.model';
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable({providedIn: 'root'})
export class ShiftsService {
  private shifts: Shift[] = [];
  private shiftsUpdated = new Subject<Shift[]>();

  constructor(private http: HttpClient) {}

  getShifts() {
    this.http.get<{message: string, shifts: Shift[]}>('http://localhost:3000/api/shifts')
      .subscribe((shiftData) => {
        this.shifts = shiftData.shifts;
        this.shiftsUpdated.next([...this.shifts]);
      });
  }

  getShiftUpdateListener() {
    return this.shiftsUpdated.asObservable();
  }

  addShift(name: string, start: string, end: string) {
    const shift: Shift = {id: null, name: name, start: start, end: end};
    this.http.post<{message: string}>('http://localhost:3000/api/shifts', shift)
      .subscribe((responseData) => {
        console.log(responseData);
        this.shifts.push(shift);
        this.shiftsUpdated.next([...this.shifts]);
      });
  }
}
