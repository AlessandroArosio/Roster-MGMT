import {Shift} from './shift.model';
import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/shifts';

@Injectable({providedIn: 'root'})
export class ShiftsService {
  private shifts: Shift[] = [];
  private shiftsUpdated = new Subject<Shift[]>();

  constructor(private http: HttpClient) {}


  getShifts() {
    this.http
      .get<{message: string, shifts: any}>(BACKEND_URL)
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

  getShift(id: string) {
    return this.http.get<{_id: string, name: string, start: string, end: string}>(
      BACKEND_URL + '/' + id);
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
    this.http.post<{message: string, shiftId: string}>(BACKEND_URL, shift)
      .subscribe((responseData) => {
        const id = responseData.shiftId;
        shift.id = id;
        this.shifts.push(shift);
        this.shiftsUpdated.next([...this.shifts]);
      });
  }

  updateShift(id: string, name: string, start: string, end: string) {
    const shift: Shift = { id: id, name: name, start: start, end: end };
    this.http.put(BACKEND_URL + '/' + id, shift)
      .subscribe(response => {
        const updatedShifts = [...this.shifts];
        const oldShiftIndex = updatedShifts.findIndex(p => p.id === shift.id);
        updatedShifts[oldShiftIndex] = shift;
        this.shifts = updatedShifts;
        this.shiftsUpdated.next([...this.shifts]);
      });
  }

  deleteShift(shiftId: string) {
    this.http.delete(BACKEND_URL + '/' + shiftId)
      .subscribe(() => {
        const updatedShift = this.shifts.filter(shift => shift.id !== shiftId);
        this.shifts = updatedShift;
        this.shiftsUpdated.next([...this.shifts]);
      });
  }
}
