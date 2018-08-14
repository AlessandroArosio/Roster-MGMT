import {Shift} from './shift.model';
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class ShiftsService {
  private shifts: Shift[] = [];
  private shiftsUpdated = new Subject<Shift[]>();

  constructor(private http: HttpClient) {}

  getShifts() {
    this.http
      .get<{message: string, shifts: any}>('http://localhost:3000/api/shifts')
      .pipe(map((shiftData) => {
        return shiftData.shifts.map(shifts => {
          return {
            name: shifts.name,
            start: shifts.start,
            end: shifts.end,
            id: shifts._id
          };
        });
      }))
      .subscribe((transformedShift) => {
        this.shifts = transformedShift;
        this.shiftsUpdated.next([...this.shifts]);
      });
  }

  getShiftUpdateListener() {
    return this.shiftsUpdated.asObservable();
  }

  addShift(name: string, start: string, end: string) {
    const shift: Shift = {
      id: null,
      name: name,
      start: start,
      end: end
    };
    this.http.post<{message: string}>('http://localhost:3000/api/shifts', shift)
      .subscribe((responseData) => {
        console.log(responseData);
        this.shifts.push(shift);
        this.shiftsUpdated.next([...this.shifts]);
      });
  }
}
