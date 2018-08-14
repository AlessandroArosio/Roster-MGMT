import {Component} from '@angular/core';
import {BranchesService} from '../branches.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-branch-create',
  templateUrl: './branch-create.component.html',
  styleUrls: ['./branch-create.component.css']
})
export class BranchCreateComponent {

  constructor(public branchesService: BranchesService) {}

  onAddBranch(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.branchesService.addBranch(
      form.value.name
    );
    form.resetForm();
  }
}
