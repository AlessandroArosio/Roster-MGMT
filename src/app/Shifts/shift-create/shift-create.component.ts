import {Component, OnInit} from '@angular/core';

import {NgForm} from '@angular/forms';
import {ShiftsService} from '../shifts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Shift} from '../shift.model';

@Component({
  selector: 'app-shift-create',
  templateUrl: './shift-create.component.html',
  styleUrls: ['./shift-create.component.css']
})
export class ShiftCreateComponent implements OnInit {
  enteredShift = '';
  enteredStart = '';
  enteredEnd = '';
  shift: Shift;
  private mode = 'create';
  private shiftId: string;

  constructor(public shiftsService: ShiftsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('shiftId')) {
        this.mode = 'edit';
        this.shiftId = paramMap.get('shiftId');
        this.shiftsService.getShift(this.shiftId).subscribe(shiftData => {
          this.shift = {id: shiftData._id, name: shiftData.name, start: shiftData.start, end: shiftData.end};
        });
      } else {
        this.mode = 'create';
        this.shiftId = null;
      }
    });
  }

  onSaveShift(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.shiftsService.addShift(
        form.value.name,
        form.value.start,
        form.value.end
      );
    } else {
      this.shiftsService.updateShift(
        this.shiftId,
        form.value.name,
        form.value.start,
        form.value.end);
    }

    form.resetForm();
  }
}
