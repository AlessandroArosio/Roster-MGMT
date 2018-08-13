import {Component} from '@angular/core';

import {NgForm} from '@angular/forms';
import {ShiftsService} from '../shifts.service';

@Component({
  selector: 'app-shift-create',
  templateUrl: './shift-create.component.html',
  styleUrls: ['./shift-create.component.css']
})
export class ShiftCreateComponent {
  enteredShift = '';
  enteredStart = '';
  enteredEnd = '';


  constructor(public shiftsService: ShiftsService) {}

  onAddShift(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.shiftsService.addShift(
      form.value.name,
      form.value.start,
      form.value.end
    );
    form.resetForm();
  }
}
