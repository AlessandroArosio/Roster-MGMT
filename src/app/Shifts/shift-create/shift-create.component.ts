import { Component} from '@angular/core';

@Component({
  selector: 'app-shift-create',
  templateUrl: './shift-create.component.html',
  styleUrls: ['./shift-create.component.css']
})
export class ShiftCreateComponent {

  onAddShift() {
    alert('post added');
  }
}
